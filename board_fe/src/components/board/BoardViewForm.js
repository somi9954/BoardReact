import React, { useEffect, useState } from 'react';
import { InputText } from '../commons/InputStyle';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const BoardBox = styled.div`
  button.sbtn3 {
    border: none;
  }
  p {
    text-align: left;
    padding: 8px;
  }
  .contentbox {
    border: 1.5px solid #f9cac8;
    border-radius: 5px;
    position: relative;
  }

  .notice {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 10px;
    border-bottom: 1px solid #d5d5d5;
  }

  .info {
    margin-bottom: 5px;
    border-bottom: 1px solid #d5d5d5;
  }

  .info strong {
    font-weight: bold;
  }

  .viewCnt {
    position: absolute;
    top: 0;
    right: 10px;
  }

  .content {
    height: 150px;
  }

  .btngp {
    text-align: center;
    margin: 10px;
    & > * {
      margin-right: 10px;
    }
    & > *:last-child {
      margin-right: 0;
    }
  }

  .sbtn {
    color: #fff;
    background: #d94c90;
    margin-left: 5px;
    border-radius: 5px;
    padding: 10px;
  }
  .comment {
    margin-top: 30px;
  }
  .comment_content {
    font-size: 1.25rem;
    cursor: pointer;
    width: 100%;
    height: 6.25em;
    resize: none;
    border: 1px solid #d5d5d5;
    border-radius: 5px;
  }

  .sbtn2 {
    display: inline-block;
    border: 1px solid #78c2ad;
    color: #78c2ad;
    padding: 1px 15px;
    height: 35px;
    line-height: 30px;
    text-align: center;
    border-radius: 5px;
    margin-left: 5px;
    float: right;
  }

  .sbtn3 {
    color: #fff;
    background: #78c2ad;
    border-radius: 5px;
    padding: 10px;
  }

  .comment_box {
    margin-top: 50px;
    .List {
      border: 1px solid #d5d5d5;
    }
    .plist {
      border-bottom: 1px solid #d5d5d5;
    }
  }
`;

const CommentBox = styled.div`
  margin-top: 50px;

  .List {
    border: 1px solid #d5d5d5;
  }

  .plist {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #d5d5d5;
    padding: 8px;
  }

  .plist span:first-child {
    font-weight: bold;
  }

  .pcontent {
    padding: 8px;
    height: 100px;
  }

  .comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .list_length {
      margin-bottom: 5px;
    }
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const BoardViewForm = ({
  boardData,
  onSubmit,
  form,
  onChange,
  currentUser,
  commentList,
  onDelete,
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
    <BoardBox>
      <div className="contentbox">
        <p className="notice">{subject}</p>
        <div>
          <p className="info">
            <strong>작성자:</strong> {poster}
          </p>
          <p className="info">
            <strong>작성일:</strong> {formatDate(createdAt)}
          </p>
        </div>
        <p className="viewCnt">
          <strong>조회수: </strong>
          {viewCnt}
        </p>
        <p className="content">{content}</p>
        <div className="btngp">
          <NavLink
            to={`/board/list/${boardData.data.board.bid}`}
            className="sbtn"
          >
            {t('목록')}
          </NavLink>
          <NavLink to={`/board/update/${boardData.data.seq}`} className="sbtn3">
            {t('수정')}
          </NavLink>
          <button onClick={onDelete} className="sbtn3">
            삭제
          </button>
        </div>
      </div>
      <div className="comment">
        <form onSubmit={(e) => onSubmit(e, form)}>
          <textarea
            type="text"
            name="content"
            className="comment_content"
            onChange={onChange}
            value={form.content || ''}
            placeholder="댓글을 입력하세요."
          />
          <InputText
            type="text"
            name="poster"
            className="poster"
            value={currentUser || ''}
            readOnly
            width="100px"
          />
          {!currentUser && (
            <InputText
              type="text"
              name="guestPw"
              className="guestPw"
              onChange={onChange}
              value={form.guestPw || ''}
              placeholder="비회원 비밀번호"
              readOnly={currentUser ? true : false}
            />
          )}
          <button type="submit" className="sbtn2">
            등록
          </button>
        </form>
      </div>
      <CommentBox>
        <div className="comment-header">
          <h1>COMMENT</h1>
          <p className="list_length">
            {commentList.length}개의 댓글이 있습니다.
          </p>
        </div>
        {commentList && commentList.length > 0 ? (
          commentList.map((comment, index) => (
            <div key={index} className="List">
              <p className="plist">
                <span>{comment.poster}</span>
                <span>{formatDate(comment.createdAt)}</span>
              </p>
              <p className="pcontent">{comment.content}</p>
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </CommentBox>
    </BoardBox>
  );
};

export default BoardViewForm;
