import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiRequest from '../../lib/apiRequest';
import BoardListForm from '../../components/board/BoardListForm';

const BoardListContainer = ({ bId }) => {
  const { t } = useTranslation();
  const [boardList, setBoardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoardList = async () => {
    try {
      const response = await apiRequest('/board/list/${bId}', 'GET');
      setBoardList(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('할 일 목록을 불러오는 중 에러 발생:', error);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  useEffect(() => {
    fetchBoardList();
  }, [bId]);

  return (
    <BoardListForm
      boardList={boardList}
      loading={loading}
      error={error}
      fetchBoardList={fetchBoardList}
    />
  );
};

export default BoardListContainer;
