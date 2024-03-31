import React from 'react';
import { InputText } from '../commons/InputStyle';

const BoardViewForm = ({ boardData }) => {
  // boardData가 null이거나 undefined인 경우 처리
  if (!boardData) {
    return <div>Loading...</div>;
  }

  // boardData에서 필요한 속성 추출
  const { subject, poster, createdAt, content, viewCnt } = boardData.data;

  return (
    <div>
      <p>{subject}</p>
      <p>작성자: {poster}</p>
      <p>작성일: {createdAt}</p>
      <p>조회수: {viewCnt}</p>
      <p>{content}</p>
      <button>목록</button>
      <button>수정</button>
      <button>삭제</button>

      <InputText type="text" name="comment" placeholder="댓글을 입력하세요." />
    </div>
  );
};

export default BoardViewForm;
