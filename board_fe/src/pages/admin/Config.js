import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {OuterBox} from '../../components/commons/OutlineStyle';
import { MainTitle } from '../../components/commons/TitleStyle';
import SiteContainer from '../../containers/admin/SiteContainer';
import Menus from './Menus';

const Config = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Helmet>
        <title>{t('사이트 설정')}</title>
      </Helmet>
      <OuterBox>
        <MainTitle color="#ff4910">{t('사이트 설정')}</MainTitle>
        <SiteContainer />
      </OuterBox>
    </div>
  )
};

export default Config;
