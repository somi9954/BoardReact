import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { OuterBox } from '../../../components/commons/OutlineStyle';
import BoardWriteContainer from '../../../containers/board/BoardWriteContainer';
import { MainTitle } from '../../../components/commons/TitleStyle';

const BoardWrite = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('커뮤니티 글쓰기')}</title>
      </Helmet>
      <OuterBox>
        <MainTitle color="#ff4910">{t('커뮤니티 글쓰기')}</MainTitle>
        <BoardWriteContainer />
      </OuterBox>
    </>
  );
};

export default BoardWrite;