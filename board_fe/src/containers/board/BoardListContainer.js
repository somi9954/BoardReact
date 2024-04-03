import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';
import BoardListForm from '../../components/board/BoardListForm';

const BoardListContainer = () => {
  const { t } = useTranslation();
  const { bId } = useParams();
  const [boardList, setBoardList] = useState({ data: [] });
  const [originalBoardList, setOriginalBoardList] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [searchKey, setSearchKey] = useState('');
  const [searchOption, setSearchOption] = useState('subject');

  useEffect(() => {
    setLoading(true);

    // 해당 게시판에 대한 데이터를 가져옵니다.
    apiRequest(`/board/list/${bId}`, 'GET')
      .then((boardListRes) => {
        console.log('Board List Response:', boardListRes.data);
        if (!boardListRes.data.success) {
          throw new Error(boardListRes.data.message);
        }

        setOriginalBoardList({
          data: boardListRes.data.data,
        });

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

  // 정렬 함수: 최신순, 등록순, 번호순
  const sortBoardList = (sortBy) => {
    setBoardList((prevState) => {
      const sortedList = [...prevState.data].sort((a, b) => {
        if (sortBy === 'createdAt' || sortBy === 'modifiedAt') {
          return new Date(b[sortBy]) - new Date(a[sortBy]);
        } else if (sortBy === 'seq') {
          return b[sortBy] - a[sortBy];
        } else {
          return 0;
        }
      });
      return { data: sortedList };
    });
  };

  // 검색 함수: 검색어를 포함하는 게시물을 찾아서 출력
  const searchBoardList = () => {
    const filteredList = originalBoardList.data.filter((item) => {
      // 검색 옵션에 따라 검색어를 어떤 필드에서 찾을 지 결정
      if (searchOption === 'subject') {
        return item.subject.includes(searchKey);
      } else if (searchOption === 'content') {
        return item.content.includes(searchKey);
      } else if (searchOption === 'poster') {
        return item.poster.includes(searchKey);
      }
      return false;
    });

    setBoardList({ data: filteredList });
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (e) => {
    const selectedSortBy = e.target.value;
    setSortBy(selectedSortBy);
    sortBoardList(selectedSortBy);
  };

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  // 검색 옵션 변경 핸들러
  const handleSearchOptionChange = (e) => {
    setSearchOption(e.target.value);
  };

  // 검색 버튼 클릭 핸들러
  const handleSearchSubmit = () => {
    searchBoardList();
  };

  // Enter 키 눌렀을 때 검색 실행
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchBoardList();
    }
  };

  return (
    <BoardListForm
      boardData={boardList}
      loading={loading}
      error={error}
      sortBoardList={sortBoardList}
      sortBy={sortBy}
      handleSortChange={handleSortChange}
      searchKey={searchKey}
      handleSearchChange={handleSearchChange}
      searchOption={searchOption}
      handleSearchOptionChange={handleSearchOptionChange}
      handleSearchSubmit={handleSearchSubmit}
      handleKeyPress={handleKeyPress}
    />
  );
};

export default BoardListContainer;
