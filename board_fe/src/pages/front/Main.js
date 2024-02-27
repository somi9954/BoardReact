import React from 'react';
import UserContext from '../../modules/user'; // 사용자 컨텍스트를 가져옵니다.
import LoginContainer from '../../containers/member/LoginContainer'; // 로그인 컨테이너를 가져옵니다.
import { useContext } from 'react';
import { OuterBox } from '../../components/commons/OutlineStyle';
import styled from 'styled-components';
import sizeNames from '../../styles/sizes';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { SubTitle } from '../../components/commons/TitleStyle';

const { medium, big } = sizeNames;

const ListBox = styled.div`

`;

const Main = () => {
  const {
    state: { isLogin },
  } = useContext(UserContext); // 사용자 로그인 상태를 가져옵니다.

  const { t } = useTranslation();

  return (
    <div>
      {/* 로그인된 상태인 경우에만 TodoList 컴포넌트를 렌더링합니다. */}
      {isLogin ? (
        <OuterBox>
          <h1>메인페이지</h1>
        </OuterBox>
      ) : (
        <div>
          <SubTitle $align="center" color="#ff4910" >{t('로그인')}</SubTitle>
          <LoginContainer />
        </div>
      )}
    </div>
  );
};

export default Main;
