import { useState, useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cookies from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import { produce } from 'immer';
import LoginForm from '../../components/member/LoginForm';
import { requestLogin } from '../../api/member/Login';
import UserContext from '../../modules/user';

const LoginContainer = () => {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});

  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    action: { updateUserInfo },
  } = useContext(UserContext);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      let hasError = false;
      const _errors = {};
      setErrors(() => _errors);

      /*필수 항목 검증 S*/
      const requiredFields = {
        email: t('NotBlank_email'),
        password: t('NotBlank_password'),
      };

      for (const field in requiredFields) {
        if (!form[field] || !form[field].trim()) {
          _errors[field] = requiredFields[field];
          hasError = true;
        }
      }
      /*필수 항목 검증 E*/

      if (hasError) {
        setErrors(() => _errors);
        return;
      }

      // 로그인 처리
      requestLogin(form)
        .then((token) => {
          // JWT 토큰을 쿠키에 저장
          cookies.save('token', token, {
            path: '/',
          });
          // 양식 초기화
          setForm(() => {});
          // 로그인 상태(isLogin -> true) , userInfo에 회원정보 업데이트
          updateUserInfo();

          //페이지 이동
          navigate('/', { replace: true });
        })
        .catch(() => {
          setErrors(() => ({
            global: t('Login_fail'),
          }));
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form],
  );

  const onPaste = useCallback((e) => {
    const pastedText = e.clipboardData.getData('text');
    setForm(
      produce((draft) => {
        e.currentTarget?.name && (draft[e.currentTarget.name] = pastedText);
      }),
    );
  }, []);

  const onChange = useCallback((e) => {
    setForm(
      produce((draft) => {
        // e.currentTarget이 null이 아닌지, e.currentTarget.name이 null이 아닌지 확인
        // 선택적 체이닝(?.)을 사용하여 단축 평가로 조건 확인
        e.currentTarget?.name &&
          (draft[e.currentTarget.name] = e.currentTarget.value);
      }),
    );
  }, []);

  return (
    <>
      <LoginForm
        onChange={onChange}
        onSubmit={onSubmit}
        errors={errors}
        onPaste={onPaste}
      />
    </>
  );
};

export default LoginContainer;
