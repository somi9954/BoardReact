import { Helmet } from 'react-helmet-async';
import React from 'react';
import useSiteConfig from '../../hooks/useSiteConfig';

const MainTitle = () => {
  const { siteTitle } = useSiteConfig();

  return (
    <>
      <Helmet>
        <title>{siteTitle || 'FreeTalk'}</title>
      </Helmet>
    </>
  );
};

export default MainTitle;
