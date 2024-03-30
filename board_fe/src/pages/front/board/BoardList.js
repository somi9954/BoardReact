import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { OuterBox } from '../../../components/commons/OutlineStyle';
import { MainTitle } from '../../../components/commons/TitleStyle';
import BoardListContainer from '../../../containers/board/BoardListContainer';

const BoardList = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('리스트')}</title>
      </Helmet>
      <OuterBox>
        <MainTitle color="#ff4910">{t('리스트')}</MainTitle>
        <BoardListContainer />
      </OuterBox>
    </>
  );
};

export default BoardList;