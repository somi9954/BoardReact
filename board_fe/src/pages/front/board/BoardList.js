import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useState } from 'react'; // useState 추가
import { OuterBox } from '../../../components/commons/OutlineStyle';
import { MainTitle } from '../../../components/commons/TitleStyle';
import BoardListContainer from '../../../containers/board/BoardListContainer';

const BoardList = () => {
  const { t } = useTranslation();
  const [bId, setBId] = useState('');

  const handleChangeBId = (newBId) => {
    setBId(newBId);
  };

  return (
    <>
      <Helmet>
        <title>{t(`커뮤니티 리스트 - ${bId}`)}</title>
      </Helmet>
      <OuterBox>
        <MainTitle color="#ff4910">{t(`커뮤니티 글쓰기 - ${bId}`)}</MainTitle>
        <BoardListContainer bId={bId} onChangeBId={handleChangeBId} />
      </OuterBox>
    </>
  );
};

export default BoardList;
