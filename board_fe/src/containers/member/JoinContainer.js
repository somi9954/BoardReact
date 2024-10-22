import React, { useState, useCallback } from 'react';
import { produce } from 'immer';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import JoinForm from '../../components/member/JoinForm';
import requestJoin from '../../api/member/join';

const JoinContainer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    agree: false,
  });
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    // 비밀번호가 8~16자이고, 영문 대소문자, 숫자, 특수문자를 최소 하나 이상 포함하는지 검사
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^*?&_])[A-Za-z\d@$!%^*?&_]{8,16}$/;

    return passwordRegex.test(password);
  };

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      /**
       * 필수 항목
       */
      const requiredFields = {
        email: t('NotBlank_email'),
        password: t('NotBlank_password'),
        confirmPassword: t('NotBlank_confirmPassword'),
        name: t('NotBlank_name'),
      };
      const _errors = {};
      let hasError = false; // 검증 실패 여부
      for (const field in requiredFields) {
        if (!form[field] || !form[field].trim()) {
          _errors[field] = _errors[field] || [];

          _errors[field].push(requiredFields[field]);

          hasError = true;
        }
      }

      // 비밀번호 필드가 비어있을 때
      if (!form.password || !form.password.trim()) {
        _errors.password = [t('NotBlank_password')]; // 에러 메시지 배열을 새로 초기화하고 추가
        hasError = true;
      } else {
        // 비밀번호가 복잡성 요구 사항을 충족하지 않을 때
        if (!validatePassword(form.password)) {
          _errors.password = [t('Password_complexity_error')]; // 복잡성 에러 메시지 추가
          hasError = true;
        }
      }

      /* 약관 동의 체크 */
      if (!form.agree) {
        _errors.agree = _errors.agree || [];
        _errors.agree.push(t('AssertTrue_join_agree'));
        hasError = true;
      }
      if (hasError) {
        setErrors((errors) => _errors);

        return;
      }

      // 회원 가입 처리
      requestJoin(form)
        .then(() => {
          // 회원 가입 성공시 처리
          setForm(() => {}); // 양식 초기화

          // 로그인 페이지 이동
          navigate('/login', { replace: true });
        })
        .catch((err) => setErrors(() => err.message));
    },
    [form, t, navigate],
  );

  const onChange = useCallback((e) => {
    const target = e.currentTarget;
    setForm(
      produce((draft) => {
        draft[target.name] = target.value;
      }),
    );
  }, []);

  const onToggle = useCallback((e) => {
    setForm(
      produce((draft) => {
        draft.agree = !draft.agree; //기본값 false로 되어있으므로 반대값을 넣어주면 true가 된다.
      }),
    );
  }, []);

  return (
    <JoinForm
      onSubmit={onSubmit}
      onChange={onChange}
      onToggle={onToggle}
      form={form}
      errors={errors}
    />
  );
};

export default React.memo(JoinContainer);
