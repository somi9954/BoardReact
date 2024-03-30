import React, { useEffect, useState } from 'react';
import Paging from '../commons/Paging';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { InputText } from '../commons/InputStyle';

const Container = styled.div`
  select {
    border: 1px solid #d5d5d5;
    min-width: 150px;
    height: 45px;
    border-radius: 5px;
    margin-bottom: 5px;
  }

  input[type='text'] {
    border: 1px solid #d5d5d5;
    width: 200px;
    height: 45px;
    padding: 0 10px;
    border-radius: 5px;
  }

  h1 {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 35px;
    line-height: 1;
    padding: 0;
  }

  .search_btn {
    height: 45px;
    line-height: 45px;
    background: #d94c90;
    color: #fff;
    padding: 0 30px;
    border: 0;
    font-size: 16px;
    text-align: center;
    border-radius: 5px;
  }

  .sbtn {
    display: inline-block;
    background: #d94c90;
    color: #fff;
    min-width: 90px;
    padding: 0 25px;
    line-height: 45px;
    text-align: center;
    border-radius: 5px;
    margin-left: 5px;
    float: right;
    font-size: 15px;
    font-weight: bold;
  }

  .table-cols {
    width: 100%;
    border-spacing: 0;
    padding: 0;

    margin-bottom: 20px;
  }
  .table-action {
    padding: 10px 0;
    border-bottom: 1px solid #d5d5d5;
    text-align: left;
  }

  .table-cols dl {
    width: 160px;
    padding: 10px 20px;
    text-align: left;
    font-weight: bold;
  }
  .input_grp {
    background: #fff;
    padding: 10px 5px;
  }
  .input_grp > * {
    margin-right: 5px;
  }

  .search {
    float: right;
  }

  .table-rows {
    width: 100%;
    border-spacing: 0;
    padding: 0;
  }
  .table-rows th {
    font-size: 15px;
    background: #f9cac8;
    color: #fff;
    border-top: 1px solid #d5d5d5;
    padding: 12px 10px;
    text-align: left;
  }
  .table-rows td {
    padding: 15px 10px;
  }
  .table-rows th,
  .table-rows td {
    border-bottom: 1px solid #d5d5d5;
    border-right: 1px solid #d5d5d5;
  }
  .table-rows th:first-of-type,
  .table-rows td:first-of-type {
    border-left: 1px solid #d5d5d5;
  }
`;

const BoardListForm = ({
  boardData,
  loading,
  error,
  sortBy,
  handleSortChange,
  searchKey,
  handleSearchChange,
  searchOption,
  handleSearchOptionChange,
  handleSearchSubmit,
  handleKeyPress,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (boardData?.data) {
      const totalCount = boardData.data.length;
      setPage((prevPage) => Math.min(prevPage, Math.ceil(totalCount / 10)));
    }
  }, [boardData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!boardData || boardData.data.length === 0) {
    return <div>No data available.</div>;
  }

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, boardData.data.length);

  return (
    <Container>
      <NavLink
        to={`/board/write/${boardData.data[0].board.bid}`}
        className="sbtn"
      >
        {t('글쓰기')}
      </NavLink>
      <select name="sopt" value={sortBy} onChange={handleSortChange}>
        <option value="createdAt">{t('최신순')}</option>
        <option value="modifiedAt">{t('등록순')}</option>
        <option value="seq">{t('번호순')}</option>
      </select>
      <table className="table-rows">
        <thead>
          <tr>
            <th width="150">{t('글번호')}</th>
            <th>{t('제목')}</th>
            <th>{t('작성자')}</th>
            <th width="200">{t('등록일')}</th>
            <th width="70">{t('조회수')}</th>
          </tr>
        </thead>
        <tbody>
          {boardData.data.slice(startIndex, endIndex).map((item, index) => (
            <tr key={startIndex + index}>
              <td>{startIndex + index + 1}</td>
              <td>{item.subject}</td>
              <td>{item.poster}</td>
              <td>{item.createdAt}</td>
              <td>{item.viewCnt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paging
        className="paging"
        page={page}
        count={boardData.data.length}
        setPage={handlePageChange}
        initialPage={page}
      />
      {/* 검색 옵션 */}
      <div className="table-cols">
        <div className="search">
          <div className="input_grp">
            <select
              name="sopt2"
              value={searchOption}
              onChange={handleSearchOptionChange}
            >
              <option value="subject">{t('제목')}</option>
              <option value="content">{t('내용')}</option>
              <option value="poster">{t('작성자')}</option>
            </select>
            <InputText
              type="text"
              name="skey"
              value={searchKey}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              placeholder={t('검색어 입력...')}
            />
            <button
              type="submit"
              className="search_btn"
              onClick={handleSearchSubmit}
            >
              {t('검색')}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BoardListForm;
