import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import loadable from '@loadable/component';
import Menus from '../../../pages/admin/Menus';
import { InputText } from '../../commons/InputStyle';
import { NavLink } from 'react-router-dom';
import Paging from '../../commons/Paging';

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

const AdminBoard = ({
  errors,
  boardList,
  loading,
  onSearch,
  onInputChange,
  searchInput,
  searchType,
  onSearchTypeChange,
  fetchBoardList,
}) => {
  const { t } = useTranslation();
  const ErrorMessages = loadable(() => import('../../commons/ErrorMessages'));
  const [selectedIds, setSelectedIds] = useState([]);
  const [modifiedBoardList, setModifiedBoardList] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (value === 'all') {
      // 전체 선택 체크박스가 변경될 때
      if (checked) {
        const selectedIds = modifiedBoardList.map((board) => board.bid);
        setSelectedIds(selectedIds);
      } else {
        setSelectedIds([]);
      }
      setSelectAllChecked(checked);
    } else {
      // 개별 체크박스가 변경될 때
      if (checked) {
        setSelectedIds([...selectedIds, value]);
      } else {
        setSelectedIds(selectedIds.filter((id) => id !== value));
      }
    }
  };

  const handleActiveChange = (event, index) => {
    const { value } = event.target;
    const updatedBoardList = [...modifiedBoardList];
    updatedBoardList[index].activeText = value;
    updatedBoardList[index].active = value === '사용' ? true : false;
    setModifiedBoardList(updatedBoardList);
  };

  const handlePermissionChange = (event, index) => {
    const { value } = event.target;
    const updatedBoardList = [...modifiedBoardList];
    updatedBoardList[index].authority = value;
    setModifiedBoardList(updatedBoardList);
  };

  useEffect(() => {
    console.log('boardList:', boardList);
    setModifiedBoardList(
      boardList.map((board) => ({
        ...board,
        activeText: board.active ? '사용' : '미사용',
      })),
    );
  }, [boardList]);

  return (
    <Container>
      <Menus />
      <div>
        <h1>{t('게시판 검색')}</h1>
        <form onSubmit={onSearch}>
          <div className="table-cols">
            <div className="search">
              <div className="input_grp">
                <dl>{t('검색어')}</dl>
                <select
                  name="sopt"
                  value={searchType}
                  onChange={onSearchTypeChange}
                >
                  <option value="all">{t('통합검색')}</option>
                  <option value="bId">{t('게시판 ID')}</option>
                  <option value="bName">{t('게시판명')}</option>
                </select>
                <InputText
                  type="text"
                  name="skey"
                  placeholder={t('검색어 입력...')}
                  value={searchInput}
                  onChange={onInputChange}
                />
                <button type="submit" className="search_btn">
                  {t('조회하기')}
                </button>
              </div>
            </div>
          </div>
        </form>
        <ErrorMessages errors={errors} field="search" />

        <h1>게시판 목록</h1>
        <table className="table-rows">
          <thead>
            <tr>
              <th width="40">
                <InputText
                  type="checkbox"
                  className="checkall"
                  id="checkall"
                  checked={selectAllChecked}
                  value="all"
                  onChange={handleCheckboxChange}
                />
              </th>
              <th width="150">게시판 ID</th>
              <th width="300">게시판명</th>
              <th width="150">사용 여부</th>
              <th width="150">글쓰기 권한</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="nodata">
                  등록된 게시판이 없습니다.
                </td>
              </tr>
            ) : modifiedBoardList && modifiedBoardList.length > 0 ? (
              modifiedBoardList.map((board, index) => (
                <tr key={board.bid}>
                  <td>
                    <InputText
                      type="checkbox"
                      className="check"
                      id={`check${board.bid}`}
                      value={board.bid}
                      checked={selectedIds.includes(board.bid)}
                      onChange={handleCheckboxChange}
                    />
                  </td>
                  <td>{board.bid}</td>
                  <td>{board.bname}</td>
                  <td>
                    <select
                      name="active"
                      value={board.activeText}
                      onChange={(event) => handleActiveChange(event, index)}
                    >
                      <option value="사용">사용</option>
                      <option value="미사용">미사용</option>
                    </select>
                  </td>
                  <td>
                    <select
                      name="permission"
                      value={board.authority}
                      onChange={(event) => handlePermissionChange(event, index)}
                    >
                      <option value="ALL">ALL(비회원+회원+관리자)</option>
                      <option value="MEMBER">MEMBER(회원+관리자)</option>
                      <option value="ADMIN">ADMIN(관리자)</option>
                    </select>
                  </td>
                  <td>
                    <div className="table-action2">
                      <NavLink
                        to={`/admin/board/edit/${board.bid}`}
                        className="sbtn2"
                      >
                        설정수정
                      </NavLink>
                      <NavLink
                        to={`/board/list/${board.bid}`}
                        className="sbtn blue2"
                      >
                        미리보기
                      </NavLink>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="nodata">
                  등록된 게시판이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="table-action">
          <button type="button" className="sbtn blue">
            선택 게시판 수정
          </button>
          <button type="button" className="sbtn">
            선택 게시판 삭제
          </button>
        </div>
        <Paging page={1} count={10} setPage={() => {}} />
      </div>
    </Container>
  );
};

export default AdminBoard;
