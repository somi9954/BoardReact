import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { OuterBox } from '../../components/commons/OutlineStyle';
import MemberListContainer from '../../containers/member/MemberListContainer';

const MemberList = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('회원관리')}</title>
      </Helmet>
      <OuterBox>
        <MemberListContainer />
      </OuterBox>
    </>
  );
};

export default React.memo(MemberList);
