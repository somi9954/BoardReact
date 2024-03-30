import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
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
        <title>{t(`${bId}`)}</title>
      </Helmet>
      <OuterBox>
        <MainTitle color="#ff4910">{t(`${bId}`)}</MainTitle>
        <BoardListContainer bId={bId} onChangeBId={handleChangeBId} />
      </OuterBox>
    </>
  );
};

export default BoardList;
