import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiRequest from '../../lib/apiRequest';
import AdminBoard from '../../components/board/admin/AdminBoard';
import BoardWriteContainer from '../board/BoardWriteContainer';

const AdminBoardListContainer = () => {
  const { t } = useTranslation();
  const [boardList, setBoardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('all');

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

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = '/admin/board/search';
      if (searchType === 'bId') {
        url += `?bid=${searchInput}`;
      } else if (searchType === 'bName') {
        url += `?bname=${searchInput}`;
      } else {
        url += `?query=${searchInput}`;
      }

      const response = await apiRequest(url, 'GET');

      if (response.data && response.data.content) {
        setBoardList(response.data.content);
        setLoading(false);
      } else {
        throw new Error('게시판을 검색하는데 실패했습니다.');
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  return (
    <AdminBoard
      boardList={boardList}
      loading={loading}
      error={error}
      onSearch={handleSearch}
      onInputChange={handleInputChange}
      onSearchTypeChange={handleSearchTypeChange}
      searchInput={searchInput}
      searchType={searchType}
    />
  );
};

export default AdminBoardListContainer;
