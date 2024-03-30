import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';
import BoardListForm from '../../components/board/BoardListForm';

const BoardListContainer = () => {
  const { t } = useTranslation();
  const { bId } = useParams();
  const [boardList, setBoardList] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    // 해당 게시판에 대한 데이터를 가져옵니다.
    apiRequest(`/board/list/${bId}`, 'GET')
      .then((boardListRes) => {
        console.log('Board List Response:', boardListRes.data);
        if (!boardListRes.data.success) {
          throw new Error(boardListRes.data.message);
        }

        // 필요한 데이터를 추출하여 상태에 설정합니다.
        setBoardList({
          data: boardListRes.data.data,
        });
      })
      .catch((err) => {
        console.error('Failed to fetch board data:', err);
        setError('Failed to fetch board data. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [bId]);

  return (
    <BoardListForm boardData={boardList} loading={loading} error={error} />
  );
};

export default BoardListContainer;
