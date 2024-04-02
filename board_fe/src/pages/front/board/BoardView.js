import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { OuterBox } from '../../../components/commons/OutlineStyle';
import { MainTitle } from '../../../components/commons/TitleStyle';
import BoardViewContainer from '../../../containers/board/BoardViewContainer';

const BoardView = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('커뮤니티 글쓰기')}</title>
      </Helmet>
      <OuterBox>
        <MainTitle color="#ff4910">{t('VIEW')}</MainTitle>
        <BoardViewContainer />
      </OuterBox>
    </>
  );
};

export default BoardView;
