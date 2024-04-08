import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { OuterBox } from '../../../components/commons/OutlineStyle';
import { MainTitle } from '../../../components/commons/TitleStyle';
import responseView from '../../../api/board/boardView';
import { useEffect, useState } from 'react';
import BoardUpdateContainer from '../../../containers/board/BoardUpdateContainer';

const BoardView = () => {
  const { t } = useTranslation();
  const [pageTitle, setPageTitle] = useState(''); // 페이지 제목을 상태로 저장

  useEffect(() => {
    const getSeqFromURL = () => {
      const parts = window.location.pathname.split('/');
      return parts[parts.length - 1];
    };

    const seq = getSeqFromURL();
    responseView(seq)
      .then((responseData) => {
        const { success, data } = responseData;
        if (success) {
          const { subject } = data;
          setPageTitle(subject);
        } else {
          console.error('Error fetching data:', responseData);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title color="#ff4910">{t(pageTitle)} 수정</title>
      </Helmet>
      <OuterBox>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MainTitle color="#ff4910">{t(pageTitle)} 수정</MainTitle>
        </div>
        <BoardUpdateContainer />
      </OuterBox>
    </>
  );
};

export default BoardView;
