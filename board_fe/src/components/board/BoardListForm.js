import React from 'react';
import Paging from '../commons/Paging';
import styled from 'styled-components';

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

const BoardListForm = ({ boardData, loading, error }) => {
  // 로딩 중일 때 표시할 내용
  if (loading) {
    return <div>Loading...</div>;
  }

  // 오류 발생 시 표시할 내용
  if (error) {
    return <div>Error: {error}</div>;
  }

  // 데이터가 비어 있는 경우
  if (!boardData || !boardData.data || boardData.data.length === 0) {
    return <div>No data available.</div>;
  }

  // 게시판 데이터가 있는 경우, 데이터를 표시
  return (
    <Container>
      <div>
        <table className="table-rows">
          <thead>
            <tr>
              <th width="150">글번호</th>
              <th>제목</th>
              <th>등록일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {boardData.data.map((item) => (
              <tr key={item.seq}>
                <td>{item.seq}</td>
                <td>{item.subject}</td>
                <td>{item.createdAt}</td>
                <td>{item.viewCnt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Paging page={1} count={10} setPage={() => {}} />
      </div>
    </Container>
  );
};

export default BoardListForm;
