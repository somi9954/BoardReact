import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { OuterBox } from '../../../components/commons/OutlineStyle';

import { MainTitle } from '../../../components/commons/TitleStyle';
import BoardUpdateContainer from '../../../containers/board/BoardUpdateContainer';

const BoardWrite = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('커뮤니티 글쓰기 수정')}</title>
      </Helmet>
      <OuterBox>
        <MainTitle color="#ff4910">{t('커뮤니티 글쓰기 수정')}</MainTitle>
        <BoardUpdateContainer />
      </OuterBox>
    </>
  );
};

export default BoardWrite;
