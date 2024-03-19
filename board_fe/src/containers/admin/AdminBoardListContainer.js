// AdminBoardListContainer.js

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiRequest from '../../lib/apiRequest';
import AdminBoard from '../../components/board/admin/AdminBoard';

const AdminBoardListContainer = () => {
  const { t } = useTranslation();
  const [boardList, setBoardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await apiRequest('/admin/board/list', 'GET');
        console.log('API 응답:', response); // API 응답 로깅

        if (response.data && response.data.content) {
          const boards = response.data.content; // 게시판 목록 추출
          setBoardList(boards);
          setLoading(false);
        } else {
          throw new Error('Failed to fetch board list');
        }
      } catch (error) {
        console.error('게시판 목록을 불러오는 중 에러 발생:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchBoardList();
  }, []);

  return (
    <AdminBoard boardList={boardList} loading={loading} error={error} />
  );
};

export default AdminBoardListContainer;
