import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
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

  return(
    <ListBox>
    <nav className="submenus">
      <NavLink
        to="/admin/board"
        className={({ isActive }) => classNames({ on: isActive })}
      >
        {t('게시판 목록')}
      </NavLink>
      <NavLink
        to="/admin/board/add"
        className={({ isActive }) => classNames({ on: isActive })}
      >
        {t('게시판 등록')}
      </NavLink>
      <NavLink
        to="/admin/board/posts"
        className={({ isActive }) => classNames({ on: isActive })}
      >
        {t('게시판 관리')}
      </NavLink>
    </nav>
  </ListBox>)
};

export default Menus;
