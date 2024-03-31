import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { OuterBox } from '../../../components/commons/OutlineStyle';
import { MainTitle } from '../../../components/commons/TitleStyle';
import BoardListContainer from '../../../containers/board/BoardListContainer';
import responseList from '../../../api/board/BoardList';

const BoardList = () => {
  const { t } = useTranslation();
  const [boardTitle, setBoardTitle] = useState('');

  useEffect(() => {
    const url = window.location.pathname;
    const bid = url.split('/').pop(); // URL에서 마지막 경로를 추출하여 게시판 ID(bid)로 사용합니다.

    // responseList 함수를 호출하여 게시판 데이터를 가져옵니다.
    responseList(bid)
      .then((data) => {
        // 데이터 확인
        if (!data || !data.data || data.data.length === 0) {
          console.error('Data is empty or invalid:', data);
          return;
        }

        // 게시판 제목 설정
        const boardData = data.data[0]; // 첫 번째 게시판 데이터를 가져옴
        if (boardData && boardData.board && boardData.board.bname) {
          setBoardTitle(boardData.board.bname); // 해당하는 게시판의 제목을 설정합니다.
        } else {
          console.error(`Board data or name not found in data:`, boardData);
        }
      })
      .catch((error) => {
        console.error('Error fetching board title:', error); // 오류 메시지 출력
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>{t(boardTitle)}</title>
      </Helmet>
      <OuterBox>
        <MainTitle color="#ff4910">{t(boardTitle)}</MainTitle>
        <BoardListContainer />
      </OuterBox>
    </>
  );
};

export default BoardList;
