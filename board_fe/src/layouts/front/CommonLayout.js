import Header from '../../outlines/front/Header';
import Footer from '../../outlines/front/Footer';
import { Outlet } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import MainClassContext from '../../modules/mainClass';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const CommonLayout = () => {
  const { mainClass, update } = useContext(MainClassContext);
  const { t } = useTranslation();

  useEffect(() => {
    update();
  }, [update]);

  return (
    <>
      <Helmet>
        <title>{t('FreeTalk')}</title>
      </Helmet>
      <Header />
      <main className={mainClass}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default CommonLayout;
