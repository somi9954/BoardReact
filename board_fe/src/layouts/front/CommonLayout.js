import Header from '../../outlines/front/Header';
import Footer from '../../outlines/front/Footer';
import { Outlet } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import MainClassContext from '../../modules/mainClass';
import { Helmet } from 'react-helmet-async';
import useSiteConfig from '../../hooks/useSiteConfig';

const CommonLayout = () => {
  const { mainClass, update } = useContext(MainClassContext);
  const { siteTitle } = useSiteConfig();

  useEffect(() => {
    update();
  }, [update]);

  return (
    <>
      <Helmet>
        <title>{siteTitle || 'FreeTalk'}</title>
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
