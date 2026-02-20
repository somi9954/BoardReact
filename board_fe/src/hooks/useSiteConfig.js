import { useEffect, useState } from 'react';
import requestPublicConfigInfo from '../api/site/configPublic';

const DEFAULT_CONFIG = {
  siteTitle: 'FreeTalk',
  siteDescription: '',
  joinTerms: '회원 가입약관....',
};

export default function useSiteConfig() {
  const [siteConfig, setSiteConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    requestPublicConfigInfo()
      .then((res) => {
        if (res?.data) {
          setSiteConfig((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => {});
  }, []);

  return siteConfig;
}
