import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom'; // useLocation hook 추가
import { useTranslation } from 'react-i18next';

const ListBox = styled.ul`
    .submenus {
        margin-top: 45px;
        background: #fff;
        box-shadow: 1px 1px 5px #cdced5;
        margin-bottom: 30px;
        display: flex;
        height: 60px;

        a.on {
            background: #F9CAC8;
            color: #fff;
        }
    }

    .submenus a {
        line-height: 60px;
        padding: 0 40px;
        font-size: 18px;
    }
`;

const Menus = () => {
  const { t } = useTranslation();
  const location = useLocation(); // 현재 경로를 가져옴

  return(
    <ListBox>
      <nav className="submenus">
        <NavLink
          to="/admin/board/list"
          className={classNames({ on: location.pathname === '/admin/board/list' })}
        >
          {t('게시판 목록')}
        </NavLink>
        <NavLink
          to="/admin/board/add"
          className={classNames({ on: location.pathname === '/admin/board/add' })}
        >
          {t('게시판 등록')}
        </NavLink>
        <NavLink
          to="/admin/board/posts"
          className={classNames({ on: location.pathname === '/admin/board/posts' })}
        >
          {t('게시판 관리')}
        </NavLink>
      </nav>
    </ListBox>)
};

export default Menus;
