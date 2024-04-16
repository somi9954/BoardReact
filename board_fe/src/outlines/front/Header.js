import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../modules/user';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import colorNames from '../../styles/colors';
import sizeNames from '../../styles/sizes';
const { info } = colorNames;
const { big, extraBig } = sizeNames;

const OuterBox = styled.header`
  background: ${({ scroll }) => (scroll === 'true' ? '#ff4910' : '#fff')};
  color: ${({ scroll }) => (scroll === 'true' ? '#fff' : info)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 15px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  transition:
    background-color 0.3s,
    color 0.3s;

  .center {
    text-align: center;
    flex-grow: 1;
    font-size: ${extraBig};
    font-weight: bold;
    a {
      color: ${({ scroll }) => (scroll === 'true' ? '#fff' : info)};
      text-decoration: none;
      transition: color 0.3s;
      margin-left: 350px;
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .right a {
    display: inline-block;
    border: 1px solid ${info};
    height: 28px;
    border-radius: 3px;
    line-height: 26px;
    color: ${info};
    font-weight: 700;
    width: 90px;
    text-align: center;
    margin-left: 5px;
  }

  .right a.on {
    background: ${info};
    color: #fff;
  }
`;

const Header = () => {
  const { t } = useTranslation();
  const {
    state: { isLogin, isAdmin },
  } = useContext(UserContext);
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <OuterBox scroll={scroll.toString()}>
      <div className="center">
        <NavLink
          to="/"
          className={({ isActive }) => classNames({ on: isActive })}
        >
          FreeTalk
        </NavLink>
      </div>
      <div className="right">
        {isLogin ? (
          <>
            <NavLink
              to="/logout"
              className={({ isActive }) => classNames({ on: isActive })}
            >
              {t('로그아웃')}
            </NavLink>
            <NavLink
              to="/board/list/freetalk"
              className={({ isActive }) => classNames({ on: isActive })}
            >
              {t('커뮤니티')}
            </NavLink>
            <NavLink
              to="/mypage"
              className={({ isActive }) => classNames({ on: isActive })}
            >
              {t('마이페이지')}
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) => classNames({ on: isActive })}
              >
                {t('사이트 관리')}
              </NavLink>
            )}
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => classNames({ on: isActive })}
            >
              {t('로그인')}
            </NavLink>
            <NavLink
              to="/board/list/freetalk"
              className={({ isActive }) => classNames({ on: isActive })}
            >
              {t('커뮤니티')}
            </NavLink>
            <NavLink
              to="/join"
              className={({ isActive }) => classNames({ on: isActive })}
            >
              {t('회원가입')}
            </NavLink>
          </>
        )}
      </div>
    </OuterBox>
  );
};

export default Header;
