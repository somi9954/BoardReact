import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { InputText } from '../commons/InputStyle';
import Paging from '../commons/Paging';

const Container = styled.div`
  select {
    border: 1px solid #d5d5d5;
    min-width: 150px;
    height: 45px;
    padding: 0 10px;
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

  h2 {
    font-size: 23px;
    margin: 35px 0 12px;
  }

  .summary {
    margin-bottom: 15px;
    font-size: 14px;
    color: #444;
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
    padding: 0 12px;
    height: 34px;
    line-height: 32px;
    text-align: center;
    border-radius: 5px;
    margin-left: 5px;
    background: #fff;
  }

  .badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    background: #edf2ff;
    color: #324f9f;
  }

  .badge.deleted {
    background: #ffe8ef;
    color: #b4235b;
  }

  .table-cols {
    width: 100%;
    border-spacing: 0;
    padding: 0;
    border-top: 1px solid #d5d5d5;
    margin-bottom: 20px;
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
    text-align: center;
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

const add30Days = (deletedAt) => {
  if (!deletedAt) return '-';
  return new Date(new Date(deletedAt).getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
};

const MemberListForm = ({
  members,
  searchOption,
  searchKey,
  handleSearchOptionChange,
  handleSearchSubmit,
  handleKeyPress,
  handleSearchChange,
  handleTypeChange,
  handleDelete,
}) => {
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState(1);
  const [deletedPage, setDeletedPage] = useState(1);
  const onDelete =
    typeof handleDelete === 'function'
      ? handleDelete
      : () => {
          alert('탈퇴 처리 기능을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        };

  const itemsPerPage = 10;

  const activeMembers = useMemo(
    () => (members || []).filter((item) => !item.deleted),
    [members],
  );
  const deletedMembers = useMemo(
    () => (members || []).filter((item) => item.deleted),
    [members],
  );

  const activeStart = (activePage - 1) * itemsPerPage;
  const activeEnd = Math.min(activeStart + itemsPerPage, activeMembers.length);

  const deletedStart = (deletedPage - 1) * itemsPerPage;
  const deletedEnd = Math.min(deletedStart + itemsPerPage, deletedMembers.length);

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

      <h1>{t('회원 목록')}</h1>
      <p className="summary">
        {t('정상 회원')}: {activeMembers.length} / {t('탈퇴 회원')}: {deletedMembers.length}
      </p>

      <h2>{t('정상 회원 목록')}</h2>
      <table className="table-rows">
        <thead>
          <tr>
            <th width="20">{t('userNo')}</th>
            <th width="100">{t('회원ID(email)')}</th>
            <th width="150">{t('사용자 이름')}</th>
            <th width="100">{t('등록일')}</th>
            <th width="70">{t('회원 타입')}</th>
            <th width="120">{t('상태')}</th>
            <th width="120">{t('권한변경')}</th>
            <th width="120">{t('탈퇴')}</th>
          </tr>
        </thead>

        {activeMembers.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan="8">{t('정상 회원 데이터가 없습니다.')}</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {activeMembers.slice(activeStart, activeEnd).map((item, index) => (
              <tr key={item.userNo}>
                <td>{activeStart + index + 1}</td>
                <td>{item.email}</td>
                <td>{item.nickname}</td>
                <td>{item.createdAt}</td>
                <td>{item.type}</td>
                <td>
                  <span className="badge">정상</span>
                </td>
                <td>
                  <select
                    value={item.type}
                    onChange={(e) => handleTypeChange(item.userNo, e.target.value)}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="sbtn"
                    onClick={() => onDelete(item.userNo)}
                  >
                    {t('탈퇴')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      <Paging
        className="paging"
        page={activePage}
        count={activeMembers.length}
        setPage={setActivePage}
        initialPage={activePage}
      />

      <h2>{t('탈퇴 회원 목록')}</h2>
      <table className="table-rows">
        <thead>
          <tr>
            <th width="20">{t('userNo')}</th>
            <th width="100">{t('회원ID(email)')}</th>
            <th width="150">{t('사용자 이름')}</th>
            <th width="100">{t('등록일')}</th>
            <th width="70">{t('회원 타입')}</th>
            <th width="120">{t('상태')}</th>
            <th width="120">{t('탈퇴일')}</th>
            <th width="120">{t('완전 삭제 예정일')}</th>
          </tr>
        </thead>

        {deletedMembers.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan="8">{t('탈퇴 회원 데이터가 없습니다.')}</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {deletedMembers.slice(deletedStart, deletedEnd).map((item, index) => (
              <tr key={item.userNo}>
                <td>{deletedStart + index + 1}</td>
                <td>{item.email}</td>
                <td>{item.nickname}</td>
                <td>{item.createdAt}</td>
                <td>{item.type}</td>
                <td>
                  <span className="badge deleted">탈퇴</span>
                </td>
                <td>{item.deletedAt || '-'}</td>
                <td>{add30Days(item.deletedAt)}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      <Paging
        className="paging"
        page={deletedPage}
        count={deletedMembers.length}
        setPage={setDeletedPage}
        initialPage={deletedPage}
      />
    </Container>
  );
};

export default MemberListForm;
