import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { OuterBox } from '../../components/commons/OutlineStyle';
import { MainTitle } from '../../components/commons/TitleStyle';
import React from 'react';
import AdminBoardWriteChangeContainer from '../../containers/admin/AdminBoardWriteChangeContainer';

const AdminBoardWrite = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('게시판 관리 - 게시판 수정')}</title>
      </Helmet>
      <OuterBox>
        <MainTitle color="#ff4910">{t('게시판 수정')}</MainTitle>
        <AdminBoardWriteChangeContainer />
      </OuterBox>
    </>
  );
};

export default AdminBoardWrite;
