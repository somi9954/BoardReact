import { useContext, useState } from 'react';
import cookies from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import MemberOnly from '../../../components/authority/MemberOnly';
import UserContext from '../../../modules/user';
import {
  requestMypageDelete,
  requestMypageUpdate,
} from '../../../api/member/Mypage';

const Mypage = () => {
  const navigate = useNavigate();
  const {
    state: { userInfo },
    action: { setUserInfo, setIsLogin, setIsAdmin, updateUserInfo },
  } = useContext(UserContext);

  const [form, setForm] = useState({
    nickname: userInfo?.nickname || '',
    mobile: userInfo?.mobile || '',
    password: '',
    confirmPassword: '',
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await requestMypageUpdate(form);
      if (res.data?.success === false) {
        alert(res.data?.message || '회원정보 수정에 실패했습니다.');
        return;
      }

      setUserInfo(res.data.data);
      updateUserInfo();
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      alert('회원정보가 수정되었습니다.');
    } catch (err) {
      alert('회원정보 수정 중 오류가 발생했습니다.');
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm('정말 회원 탈퇴하시겠습니까?');
    if (!confirmed) return;

    try {
      const res = await requestMypageDelete();
      if (res.data?.success === false) {
        alert(res.data?.message || '회원 탈퇴에 실패했습니다.');
        return;
      }

      cookies.remove('token', { path: '/' });
      setIsLogin(false);
      setIsAdmin(false);
      setUserInfo({});
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/', { replace: true });
    } catch (err) {
      alert('회원 탈퇴 중 오류가 발생했습니다.');
    }
  };

  return (
    <MemberOnly>
      <h1>마이페이지</h1>
      <p>이메일: {userInfo?.email}</p>
      <p>회원유형: {userInfo?.type}</p>

      <form onSubmit={onSubmit}>
        <p>
          닉네임:{' '}
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={onChange}
          />
        </p>
        <p>
          연락처:{' '}
          <input
            type="text"
            name="mobile"
            value={form.mobile}
            onChange={onChange}
          />
        </p>
        <p>
          새 비밀번호:{' '}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
          />
        </p>
        <p>
          새 비밀번호 확인:{' '}
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
          />
        </p>
        <button type="submit">회원정보 수정</button>
      </form>

      <button type="button" onClick={onDelete}>
        회원 탈퇴
      </button>
    </MemberOnly>
  );
};

export default Mypage;
