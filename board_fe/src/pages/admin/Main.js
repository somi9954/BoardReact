import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { OuterBox } from '../../components/commons/OutlineStyle';
import AdminBoardListContainer from '../../containers/admin/AdminBoardListContainer';

const Main = () => {
  const { t } = useTranslation();

  const onSelectBoard = (boardId) => {
    console.log(`Selected board with ID: ${boardId}`);
  };

  return (
    <>
      <Helmet>
        <title>{t('게시판 관리 - 게시판 목록')}</title>
      </Helmet>
      <OuterBox>
      <AdminBoardListContainer />
      </OuterBox>
    </>
  );
};

export default React.memo(Main);
