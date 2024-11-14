import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import loadable from '@loadable/component';
import { InputText } from '../commons/InputStyle';
import { NavLink, useNavigate } from 'react-router-dom';
import Paging from '../commons/Paging';

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
    background: #d94c90;
    color: #fff;
    padding: 0 30px;
    border: 0;
    font-size: 16px;
    text-align: center;
  }

  .sbtn {
    display: inline-block;
    border: 1px solid #d94c90;
    color: #d94c90;
    min-width: 90px;
    padding: 0 20px;
    height: 28px;
    line-height: 26px;
    text-align: center;
    border-radius: 5px;
    margin-left: 5px;
  }
  .sbtn.blue {
    color: #fff;
    background: #d94c90;
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
    text-align: left;
  }

  .table-action2 {
    padding: 10px 0;
    text-align: center;
  }

  .sbtn2 {
    display: inline-block;
    border: 1px solid #d94c90;
    color: #d94c90;
    min-width: 90px;
    padding: 0 20px;
    height: 28px;
    line-height: 26px;
    text-align: center;
    border-radius: 5px;
  }
  .sbtn.blue2 {
    color: #fff;
    background: #d94c90;
    margin-left: 5px;
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
    background: #f9cac8;
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

const MemberListForm = ({
  members,
  searchOption,
  searchKey,
  handleSearchOptionChange,
  handleSearchSubmit,
  handleKeyPress,
  handleSearchChange,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, members?.length || 0);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <Container>
      <div>
        <h1>{t('회원 검색')}</h1>
        <div className="table-cols">
          <div className="search">
            <div className="input_grp">
              <dl>{t('검색어')}</dl>
              <select
                name="sopt"
                value={searchOption}
                onChange={handleSearchOptionChange}
              >
                <option value="all">{t('통합검색')}</option>
                <option value="email">{t('아이디(email)')}</option>
                <option value="nickname">{t('사용자 이름')}</option>
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
                {t('조회하기')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <h1>회원 목록</h1>
      <table className="table-rows">
        <thead>
          <tr>
            <th width="20">{t('userNo')}</th>
            <th width="100">{t('회원ID(email)')}</th>
            <th width="150">{t('사용자 이름')}</th>
            <th width="100">{t('등록일')}</th>
            <th width="70">{t('회원 타입')}</th>
            <th></th>
          </tr>
        </thead>

        {members?.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan="5">{t('회원 데이터가 없습니다.')}</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {members?.slice(startIndex, endIndex).map((item, index) => (
              <tr key={item.userNo}>
                <td>{startIndex + index + 1}</td>
                <td>{item.email}</td>
                <td>{item.nickname}</td>
                <td>{item.createdAt}</td>
                <td>{item.type}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      <Paging
        className="paging"
        page={page}
        count={members?.length || 0}
        setPage={handlePageChange}
        initialPage={page}
      />
    </Container>
  );
};

export default MemberListForm;
