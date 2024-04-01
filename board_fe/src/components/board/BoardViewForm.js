import React, { useEffect, useState } from 'react';
import { InputText } from '../commons/InputStyle';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const BoardViewForm = ({
  boardData,
  onSubmit,
  form,
  onChange,
  currentUser,
  commentList,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading || !boardData || !boardData.data) {
    return <div>Loading...</div>;
  }

  const { subject, createdAt, content, viewCnt, poster } = boardData.data;

  return (
    <div>
      <h3>{subject}</h3>
      <p>작성자: {poster}</p>
      <p>작성일: {createdAt}</p>
      <p>조회수: {viewCnt}</p>
      <p>{content}</p>
      <NavLink to={`/board/list/${boardData.data.board.bid}`} className="sbtn">
        {t('목록')}
      </NavLink>
      <button>수정</button>
      <button>삭제</button>
      <form onSubmit={(e) => onSubmit(e, form)}>
        <InputText
          type="text"
          name="content"
          onChange={onChange}
          value={form.content || ''}
          placeholder="댓글을 입력하세요."
        />
        <InputText
          type="text"
          name="poster"
          value={currentUser || ''}
          readOnly
        />
        {!currentUser && (
          <InputText
            type="text"
            name="guestPw"
            onChange={onChange}
            value={form.guestPw || ''}
            placeholder="비회원 비밀번호"
            readOnly={currentUser ? true : false}
          />
        )}
        <button type="submit">등록</button>
      </form>
      <h1>댓글 목록</h1>
      {commentList && commentList.length > 0 ? (
        commentList.map((comment, index) => (
          <div key={index}>
            <p>{comment.content}</p>
            <p>{comment.poster}</p>
            <p>{comment.createdAt}</p>
          </div>
        ))
      ) : (
        <p>댓글이 없습니다.</p>
      )}
    </div>
  );
};

export default BoardViewForm;
