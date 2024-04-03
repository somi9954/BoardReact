import React, { useEffect, useState, useCallback } from 'react';
import BoardViewForm from '../../components/board/BoardViewForm';
import responseView from '../../api/board/boardView';
import requestCommentWrite from '../../api/Comment/CommentWrite';
import requestDelete from '../../api/board/boardDelete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../api/member/Login';
import { produce } from 'immer';
import responseList from '../../api/Comment/CommentList';
import requestCommentDelete from '../../api/Comment/CommentDelete';
import responseCommentUpdate from '../../api/Comment/CommentUpdate';

const BoardViewContainer = () => {
  const [boardData, setBoardData] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [boardBid, setBoardBid] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ content: '', poster: '', guestPw: '' });
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seq = getSeqFromURL();
        if (seq !== undefined) {
          const responseData = await responseView(seq);
          setBoardData(responseData);
          setBoardBid(responseData?.data?.board?.bid); // 게시판 bid 설정
          const commentData = await responseList(seq);
          setCommentList(commentData);
          increaseViewCount(seq);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userInfo = await getUserInfo();
        setCurrentUser(userInfo.nickname);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const onSubmit = useCallback(
    async (e, formData) => {
      e.preventDefault();

      const requiredFields = {
        content: t('NotBlank_content'),
      };
      const _errors = {};
      let hasError = false;
      for (const field in requiredFields) {
        if (!formData[field] || !formData[field].trim()) {
          _errors[field] = _errors[field] || [];
          _errors[field].push(requiredFields[field]);
          hasError = true;
        }
      }

      if (hasError) {
        setErrors(_errors);
        return;
      }

      const seq = getSeqFromURL();
      const postData = {
        ...formData,
        poster: currentUser || formData.poster || '',
        boardDataSeq: seq,
      };

      try {
        await requestCommentWrite(postData);
        const commentData = await responseList(seq);
        setCommentList(commentData);
        setForm((prevForm) => ({ ...prevForm, content: '' }));
        navigate(`/board/view/${seq}`, { replace: true });
      } catch (error) {
        console.error('Error adding comment:', error);
        setErrors(error.message);
      }
    },
    [t, navigate, currentUser],
  );

  const onDelete = async () => {
    const seq = getSeqFromURL(); // 현재 페이지의 게시글 ID를 추출합니다.
    try {
      const confirmed = window.confirm('정말 삭제하시겠습니까?');
      if (!confirmed) return;

      if (currentUser !== boardData?.data?.poster) {
        alert('작성자만 삭제할 수 있습니다.');
        return;
      }

      await requestDelete(seq);
      navigate(`/board/list/${boardBid}`, { replace: true });
    } catch (error) {
      console.error('게시판 삭제 오류:', error);
    }
  };

  const onCommentDelete = async (seq) => {
    try {
      const confirmed = window.confirm('정말 삭제하시겠습니까?');
      if (!confirmed) return;

      const isAuthor = commentList.some(
        (comment) => currentUser === comment.poster,
      );
      if (!isAuthor) {
        alert('작성자만 삭제할 수 있습니다.');
        return;
      }

      await requestCommentDelete(seq);
      const newCommentList = await responseList(getSeqFromURL());
      setCommentList(newCommentList);
      navigate(`/board/view/${boardData.data.seq}`, { replace: true });
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  const increaseViewCount = async (seq) => {
    try {
      await fetch(`/board/view/${seq}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Error increasing view count:', error);
    }
  };

  const getSeqFromURL = () => {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1];
  };

  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(
      produce((draft) => {
        draft[name] = value;
      }),
    );
  }, []);

  const onKeyDownHandler = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 엔터 키의 기본 동작을 중지합니다.
      // 댓글을 등록하는 함수 호출
      onSubmit(e, form);
    }
  };

  const onCommentUpdate = async (seq, updatedContent) => {
    try {
      // 댓글 수정 API 호출
      await responseCommentUpdate(seq, { content: updatedContent });
      // 수정 후 댓글 목록을 다시 불러와서 갱신
      const updatedCommentList = await responseList(getSeqFromURL());
      setCommentList(updatedCommentList);
      // 게시글 뷰 페이지로 이동
      navigate(`/board/view/${boardData.data.seq}`, { replace: true });
    } catch (error) {
      console.error('댓글 수정 오류:', error);
    }
  };

  return (
    <BoardViewForm
      boardData={boardData}
      onSubmit={onSubmit}
      onDelete={onDelete}
      form={form}
      onChange={onChange}
      currentUser={currentUser}
      commentList={commentList}
      onCommentDelete={onCommentDelete}
      onKeyDownHandler={onKeyDownHandler}
      onCommentUpdate={onCommentUpdate}
      commentList={commentList.map((comment) => ({
        ...comment,
        onDelete: () => onCommentDelete(comment.seq), // 각 댓글에 삭제 함수 추가
      }))}
    />
  );
};

export default BoardViewContainer;
