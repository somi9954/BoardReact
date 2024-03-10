import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import loadable from '@loadable/component';
import Menus from '../../../pages/admin/Menus';

const Container = styled.div`
  select {
    border: 1px solid #d5d5d5;
    min-width: 150px;
    height: 45px;
    border-radius: 5px;
  }

  input[type='text'] {
    border: 1px solid #d5d5d5;
    width: 100%;
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
    background: #D94C90;
    color: #fff;
    padding: 0 30px;
    border: 0;
    font-size: 16px;
    text-align: center;
  }

  .sbtn {
    display: inline-block;
    border: 1px solid #D94C90;
    color: #D94C90;
    min-width: 90px;
    padding: 0 20px;
    height: 28px;
    line-height: 26px;
    text-align: center;
    border-radius: 5px;
  }
  .sbtn.blue {
    color: #fff;
    background: #D94C90;
    margin-left: 5px;
  }
  .table-cols {
    width: 100%;
    border-spacing: 0;
    padding: 0;
    border-top: 1px solid #d5d5d5;
    margin-bottom: 20px;
  }
  .table-action {
    padding: 10px 0;
    border-bottom: 1px solid #d5d5d5;
    text-align: center;
  }

  .table-cols dl {
    width: 160px;
    padding: 10px 20px;
    text-align: left;
    font-weight: bold;
  }
  .input_grp {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 10px 15px;
  }
  .input_grp > * {
    margin-right: 5px;
  }
  .search {
    border-bottom: 1px solid #d5d5d5;
  }
  .table-rows {
    width: 100%;
    border-spacing: 0;
    padding: 0;
  }
  .table-rows th {
    background: #F9CAC8;
    color: #fff;
    border-top: 1px solid #d5d5d5;
    padding: 12px 10px;
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

const AdminBoard = ({ errors, items }) => {
  const { t } = useTranslation();

  const ErrorMessages = loadable(() => import('../../commons/ErrorMessages'));

  const code = 'board';
  const [selectedIds, setSelectedIds] = useState([]);


  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    setSelectedIds((prevSelectedIds) => {
      if (checked) {
        return [...prevSelectedIds, value];
      } else {
        return prevSelectedIds.filter((selectedId) => selectedId !== value);
      }
    });
  };

  // items가 undefined 또는 null인 경우를 확인하고 isEmpty를 설정합니다.
  const isEmpty = !items || items.length === 0;

  return (
    <Container>
      <Menus />
      <div>
        <h1>게시판 검색</h1>
        <form>
          <div className="table-cols">
            <div className="search">
              <div className="input_grp">
                <dl>검색어</dl>
                <select name="sopt">
                  <option value="all">통합검색</option>
                  <option value="bId">게시판 ID</option>
                  <option value="bName">게시판명</option>
                </select>
                <input type="text" name="skey" placeholder="검색어 입력..." />
                <button type="submit" className="search_btn">
                  {t('조회하기')}
                </button>
              </div>
            </div>
          </div>
          <ErrorMessages errors={errors} field="search" />
        </form>



        <h1>게시판 목록</h1>
        <form
          name="frmList"
          method="post"
          action="/admin/board"
          autoComplete="off"
          target="ifrmProcess"
        >
          <input type="hidden" name="_method" value="patch" />
          <table className="table-rows">
            <thead>
            <tr>
              <th width="40">
                <input
                  type="checkbox"
                  className="checkall"
                  id="checkall"
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="checkall"></label>
              </th>
              <th width="150">게시판 ID</th>
              <th width="300">게시판명</th>
              <th width="150">사용 여부</th>
              <th width="150">글쓰기 권한</th>
              <th></th>
            </tr>
            {isEmpty && (
              <tr>
                <td colSpan="6" className="nodata">
                  등록된 게시판이 없습니다.
                </td>
              </tr>
            )}
            </thead>
          </table>
          <div className="table-action">
            <button type="button" className="sbtn">
              수정하기
            </button>
            <button type="button" className="sbtn blue">
              삭제하기
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default AdminBoard;