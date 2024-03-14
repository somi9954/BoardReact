import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RequestConfigWrite from '../../api/admin/configboardWrite';
import ConfigBoardForm from '../../components/board/admin/configBoardForm';
import { useTranslation } from 'react-i18next';

const AdminBoardWriteContainer = ({ mode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mode: mode,
    bId: '',
    bName: '',
    category: '',
    active: false,
    authority: 'ALL'
  });

  const [errors, setErrors] = useState({});

  const onSubmit = useCallback((e) => {
    e.preventDefault();

    const requiredFields = {
      bId: t('NotBlank_boardId'),
      bName: t('NotBlank_boardName'),
    };

    const _errors = {};
    let hasError = false;
    for (const field in requiredFields) {
      if (!form[field] || !form[field].trim()) {
        _errors[field] = _errors[field] || [];
        _errors[field].push(requiredFields[field]);

        hasError = true;
      }
    }

    if (hasError) {
      setErrors((errors) => _errors);
      return;
    }

    setErrors(_errors);

    RequestConfigWrite(form)
      .then((data) => {
        console.log('작성 요청 성공:', data);

        setForm({
          mode: mode,
          bId: '',
          bName: '',
          category: '',
          active: false,
          authority: 'ALL'
        });

        navigate(`/admin/board`, { replace: true });
      })
      .catch((error) => {
        console.error('작성 요청 오류:', error);
        setErrors({ message: error });
      });
  }, [form, mode, navigate, errors, t]);

  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  }, []);

  const onActive = useCallback(
    (active) => setForm((form) => ({ ...form, active })),
    [],
  );

  const onAuthority = useCallback(
    (mode, authority) =>
      setForm((form) => ({ ...form, [`${mode}Authority`]: authority })),
    [],
  );

  return (
    <ConfigBoardForm
      onSubmit={onSubmit}
      onChange={onChange}
      form={form}
      errors={errors}
      onActive={onActive}
      onAuthority={onAuthority}
    />
  );
};

export default AdminBoardWriteContainer;
