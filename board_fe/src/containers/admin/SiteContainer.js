import React, { useState, useCallback, useEffect } from 'react';
import { produce } from 'immer';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SiteConfig from '../../components/board/admin/SiteConfig';
import requestConfig from '../../api/admin/config';
import requestConfigInfo from '../../api/admin/configInfo';

const SiteContainer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cssJsVersion: 1,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await requestConfigInfo();
        if (res?.data) {
          setForm((prev) => ({
            ...prev,
            ...res.data,
            cssJsVersion: res.data.cssJsVersion || 1,
          }));
        }
      } catch (err) {}
    };

    fetchConfig();
  }, []);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // 필수 항목
      const requiredFields = {
        siteTitle: t('NotBlank_siteTitle'),
        siteDescription: t('NotBlank_siteDescription'),
        joinTerms: t('NotBlank_joinTerms'),
      };
      const _errors = {};
      let hasError = false; // 검증 실패 여부
      for (const field in requiredFields) {
        if (!form[field] || !form[field].trim()) {
          _errors[field] = _errors[field] || [];
          _errors[field].push(requiredFields[field]);

          hasError = true; //eslint-disable-line no-unused-vars
        }
      }

      if (hasError) {
        setErrors(_errors);
        return;
      }

      try {
        await requestConfig(form);
        alert('사이트 설정이 저장되었습니다.');
        navigate('/admin/config', { replace: true });
      } catch (err) {
        setErrors({ message: err.message });
      }
    },
    [form, t, navigate],
  );

  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(
      produce((draft) => {
        draft[name] = value;
      }),
    );
  }, []);


  return (
    <SiteConfig
      onSubmit={onSubmit}
      onChange={onChange}
      form={form}
      errors={errors}
    />
  );
};

export default React.memo(SiteContainer);
