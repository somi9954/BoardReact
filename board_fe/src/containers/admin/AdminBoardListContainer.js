import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiRequest from '../../lib/apiRequest';
import AdminBoard from '../../components/board/admin/AdminBoard';

const AdminBoardListContainer = () => {
  const { t } = useTranslation();
  const [boardList, setBoardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchBoardList();
  }, []);

  const fetchBoardList = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/admin/board/list', 'GET');
      console.log('API 응답:', response);

      if (response.data && response.data.content) {
        setBoardList(response.data.content);
        setLoading(false);
      } else {
        throw new Error('게시판 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('게시판 목록을 불러오는 중 에러 발생:', error);
      setError(error);
      setLoading(false);
    }
  };

  return (
    <AdminBoard
      boardList={boardList}
      loading={loading}
      error={error}
      fetchBoardList={fetchBoardList}
    />
  );
};

export default AdminBoardListContainer;
