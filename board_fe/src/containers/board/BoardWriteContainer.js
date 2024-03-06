import React, { useState, useCallback } from 'react';
import { produce } from 'immer';
import { useNavigate } from 'react-router-dom';
import BoardForm from '../../components/board/BoardForm';
import requestWrite from '../../api/board/boardWrite';

const BoardWriteContainer = ({ tId }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const requiredFields = {
        subject: '제목을 입력하세요.',
        content: '내용을 입력하세요.',
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
        setErrors(_errors);
        return;
      }

      requestWrite(form, tId)
        .then((data) => {
          setForm({});
          navigate(`/board/view/${data.seq}`, { replace: true });
        })
        .catch((err) => {
          setErrors({ message: err });
        });
    },
    [form, tId, navigate]
  );

  const onChange = useCallback((e) => {
    const target = e.currentTarget;
    setForm(
      produce((draft) => {
        draft[target.name] = target.value;
      })
    );
  }, []);

  return (
    <BoardForm
      onSubmit={onSubmit}
      onChange={onChange}
      form={form}
      errors={errors}
    />
  );
};

export default React.memo(BoardWriteContainer);
