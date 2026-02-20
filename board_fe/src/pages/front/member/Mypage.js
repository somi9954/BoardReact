import { useContext, useRef, useState } from 'react';
import cookies from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MemberOnly from '../../../components/authority/MemberOnly';
import UserContext from '../../../modules/user';
import { OuterBox } from '../../../components/commons/OutlineStyle';
import { MainTitle, SubTitle } from '../../../components/commons/TitleStyle';
import { InputText } from '../../../components/commons/InputStyle';
import { BigButton, ButtonGroup } from '../../../components/commons/ButtonStyle';
import {
  requestMypageDelete,
  requestMypageDeleteSummary,
  requestMypageUpdate,
  requestProfileImageUpload,
} from '../../../api/member/Mypage';

const FormBox = styled.form`
  dl {
    display: flex;
    align-items: center;
    padding: 10px 15px;
  }

  dt {
    width: 150px;
    font-size: 15px;
    font-weight: bold;
  }

  dd {
    flex-grow: 1;
    margin: 0;
  }

  dl + dl {
    border-top: 1px solid #d5d5d5;
  }
`;

const InfoBox = styled.div`
  margin-bottom: 20px;
  .profile {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .thumb {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid #d5d5d5;
  }

  .profile-upload {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    margin: 6px 0;
    font-size: 15px;
  }
`;

const DangerText = styled.p`
  margin: 15px 0 0;
  color: #d94c90;
  font-size: 14px;
`;


const Mypage = () => {
  const navigate = useNavigate();
  const {
    state: { userInfo },
    action: { setUserInfo, setIsLogin, setIsAdmin },
  } = useContext(UserContext);
  const profileImageInputRef = useRef(null);

  const avatarUrl =
    userInfo?.profileImage ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(userInfo?.nickname || userInfo?.email || 'USER')}`;

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

  const onUploadProfileImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await requestProfileImageUpload(file);
      if (res.data?.success === false) {
        alert(res.data?.message || '프로필 이미지 변경에 실패했습니다.');
        return;
      }

      setUserInfo(res.data.data);
      alert(res.data?.message || '프로필 이미지가 변경되었습니다.');
    } catch (err) {
      alert('프로필 이미지 변경 중 오류가 발생했습니다.');
    } finally {
      e.target.value = '';
    }
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
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      alert('회원정보가 수정되었습니다.');
    } catch (err) {
      alert('회원정보 수정 중 오류가 발생했습니다.');
    }
  };

  const onDelete = async () => {
    try {
      const summaryRes = await requestMypageDeleteSummary();
      if (summaryRes.data?.success === false) {
        alert(summaryRes.data?.message || '탈퇴 전 게시글/댓글 정보를 조회하지 못했습니다.');
        return;
      }

      const boardCount = summaryRes.data?.data?.boardCount || 0;
      const commentCount = summaryRes.data?.data?.commentCount || 0;

      const confirmed = window.confirm(
        `회원 탈퇴를 진행하면 게시글 ${boardCount}개, 댓글 ${commentCount}개가 삭제됩니다.\n정말 탈퇴하시겠습니까?`,
      );
      if (!confirmed) return;

      const res = await requestMypageDelete();
      if (res.data?.success === false) {
        alert(res.data?.message || '회원 탈퇴에 실패했습니다.');
        return;
      }

      cookies.remove('token', { path: '/' });
      setIsLogin(false);
      setIsAdmin(false);
      setUserInfo({});
      alert(res.data?.message || '회원 탈퇴가 완료되었습니다.');
      navigate('/', { replace: true });
    } catch (err) {
      alert('회원 탈퇴 중 오류가 발생했습니다.');
    }
  };

  return (
    <MemberOnly>
      <OuterBox>
        <MainTitle color="info">마이페이지</MainTitle>
        <InfoBox>
          <div className="profile">
            <img className="thumb" src={avatarUrl} alt="프로필 이미지" />
            <p>{userInfo?.nickname || '사용자'} 님</p>
          </div>
          <div className="profile-upload">
            <input
              ref={profileImageInputRef}
              type="file"
              accept="image/*"
              onChange={onUploadProfileImage}
              style={{ display: 'none' }}
            />
            <BigButton
              type="button"
              color="white"
              fcolor="info"
              bcolor="info"
              width="160px"
              height="36px"
              onClick={() => profileImageInputRef.current?.click()}
            >
              프로필 사진 업로드
            </BigButton>
          </div>
          <DangerText>탈퇴를 진행하면 즉시 로그아웃되며, 계정은 30일 뒤에 영구 삭제됩니다.</DangerText>
        </InfoBox>

        <SubTitle color="info" border_width={1}>
          회원정보 수정
        </SubTitle>

        <FormBox onSubmit={onSubmit}>
          <dl>
            <dt>닉네임</dt>
            <dd>
              <InputText
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={onChange}
              />
            </dd>
          </dl>
          <dl>
            <dt>연락처</dt>
            <dd>
              <InputText
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={onChange}
              />
            </dd>
          </dl>
          <dl>
            <dt>새 비밀번호</dt>
            <dd>
              <InputText
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
              />
            </dd>
          </dl>
          <dl>
            <dt>새 비밀번호 확인</dt>
            <dd>
              <InputText
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
              />
            </dd>
          </dl>

          <ButtonGroup>
            <BigButton type="submit" color="info" bcolor="info" height="45px">
              회원정보 수정
            </BigButton>
            <BigButton
              type="button"
              color="white"
              fcolor="info"
              bcolor="info"
              height="45px"
              onClick={onDelete}
            >
              회원 탈퇴
            </BigButton>
          </ButtonGroup>
        </FormBox>
      </OuterBox>
    </MemberOnly>
  );
};

export default Mypage;
