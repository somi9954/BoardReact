import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import React from 'react';

const MainTitle = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('FreeTalk')}</title>
      </Helmet>
    </>
  );
};

export default MainTitle;
