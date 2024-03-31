import { useEffect, useState } from 'react';
import BoardViewForm from '../../components/board/BoardViewForm';
import responseView from '../../api/board/boardView';

const BoardViewContainer = () => {
  const [boardData, setBoardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seq = getSeqFromURL(); // 현재 URL에서 시퀀스 추출
        if (seq !== undefined) {
          const responseData = await responseView(seq); // seq를 전달하여 데이터 가져오기
          setBoardData(responseData); // 가져온 데이터 설정
          console.log('Data fetched successfully:', responseData); // 데이터 확인을 위해 콘솔에 출력
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // 현재 URL에서 시퀀스를 추출하는 함수
  const getSeqFromURL = () => {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1];
  };

  return <BoardViewForm boardData={boardData} />;
};

export default BoardViewContainer;
