import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiRequest from '../../lib/apiRequest';
import AdminBoard from '../../components/board/admin/AdminBoard';

const AdminBoardListContainer = () => {
  const { t } = useTranslation();
  const [boardList, setBoardList] = useState([]);
  const [originalBoardList, setOriginalBoardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [searchOption, setSearchOption] = useState('all');

  useEffect(() => {
    fetchBoardList();
  }, []);

  const fetchBoardList = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/admin/board/list', 'GET');

      if (response.data && response.data.content) {
        setOriginalBoardList(response.data.content);
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

  const searchBoardList = () => {
    const filteredList = originalBoardList.filter((item) => {
      if (searchOption === 'all') {
        return (
          (item.bid && item.bid.includes(searchKey)) ||
          (item.bname && item.bname.includes(searchKey))
        );
      } else if (searchOption === 'bid') {
        return item.bid && item.bid.includes(searchKey);
      } else if (searchOption === 'bname') {
        return item.bname && item.bname.includes(searchKey);
      }
      return false;
    });

    setBoardList(filteredList);
  };

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  const handleSearchOptionChange = (e) => {
    setSearchOption(e.target.value);
  };

  const handleSearchSubmit = () => {
    searchBoardList();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchBoardList();
    }
  };

  return (
    <AdminBoard
      boardList={boardList}
      loading={loading}
      error={error}
      fetchBoardList={fetchBoardList}
      searchKey={searchKey}
      handleSearchChange={handleSearchChange}
      searchOption={searchOption}
      handleSearchOptionChange={handleSearchOptionChange}
      handleSearchSubmit={handleSearchSubmit}
      handleKeyPress={handleKeyPress}
    />
  );
};

export default AdminBoardListContainer;
