import React from 'react';
import classNames from 'classnames';
import UserContext from '../../modules/user';
import LoginContainer from '../../containers/member/LoginContainer';
import { useContext } from 'react';
import { OuterBox } from '../../components/commons/OutlineStyle';
import styled from 'styled-components';
import sizeNames from '../../styles/sizes';
import { useTranslation } from 'react-i18next';
import { SubTitle } from '../../components/commons/TitleStyle';
import { NavLink } from 'react-router-dom';
import Banner from '../../components/commons/Banner';
import mini from '../../images/main/mini.jpg';

const { medium, big } = sizeNames;

const ListBox = styled.nav`
    white-space: pre-wrap;
    width: 100%;
    display: flex;
    gap: 30px;
    justify-content: center;

    .menubar {
        padding: 15px 0;
        border: 2px solid #f60404;
        border-radius: 5px;
        font-weight: bold;
        font-size: 15px;

        a {
            padding: 15px;
            white-space: nowrap;
        }
    }
`;

const BoardList = styled.div`
    display: flex;
    flex-direction: row; 
    align-items: center; 
    gap: 20px; 
    justify-content: space-between;
    
    h1 {
        text-align: left;
        padding: 5px 10px;
        border-radius: 2px;
    }
`;

const MiniBanner = styled.img`
    width: 500px; 
    height: auto;
    
`;

const Main = () => {
  const { state: { isLogin } } = useContext(UserContext);
  const { t } = useTranslation();

  return (
    <div>
      {isLogin ? (
        <OuterBox>
          <ListBox>
            <div className="menubar">
              <NavLink to="/Community" className={({ isActive }) => classNames({ on: isActive })}>
                {t('커뮤니티')}
              </NavLink>
            </div>
            <div className="menubar">
              <NavLink to="/Siteinfo" className={({ isActive }) => classNames({ on: isActive })}>
                {t('사이트정보')}
              </NavLink>
            </div>
          </ListBox>
          <Banner />
          <BoardList className="boardlist">
            <h1>커뮤니티</h1>
            <MiniBanner src={mini} alt="미니배너" />
          </BoardList>
        </OuterBox>
      ) : (
        <div>
          <SubTitle $align="center" color="#ff4910">{t('로그인')}</SubTitle>
          <LoginContainer />
        </div>
      )}
    </div>
  );
};

export default React.memo(Main);
