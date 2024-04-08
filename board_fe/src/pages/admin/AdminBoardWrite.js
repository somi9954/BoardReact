import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { OuterBox } from '../../components/commons/OutlineStyle';
import { MainTitle } from '../../components/commons/TitleStyle';
import React from 'react';
import AdminBoardWriteContainer from '../../containers/admin/AdminBoardWriteContainer';
import Menus from './Menus';

const AdminBoardWrite = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('게시판 관리 - 게시판 등록')}</title>
      </Helmet>
      <OuterBox>
        <Menus />
        <MainTitle color="#ff4910">{t('게시판 등록')}</MainTitle>
        <AdminBoardWriteContainer />
      </OuterBox>
    </>
  );
};

export default AdminBoardWrite;
