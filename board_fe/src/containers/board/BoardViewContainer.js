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

const BoardViewContainer = () => {
  const [boardData, setBoardData] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ content: '', poster: '', guestPw: '' });
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seq = getSeqFromURL();
        console.log('seq', seq);
        if (seq !== undefined) {
          const responseData = await responseView(seq);
          setBoardData(responseData);
          const commentData = await responseList(seq);
          setCommentList(commentData);
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
        // 댓글 추가 후에 새로 데이터를 불러오도록 수정
        const commentData = await responseList(seq);
        setCommentList(commentData);
        navigate(`/board/view/${seq}`, { replace: true });
      } catch (error) {
        console.error('Error adding comment:', error);
        setErrors(error.message);
      }
    },
    [t, navigate, currentUser],
  );

  const onDelete = async () => {
    const seq = getSeqFromURL();
    try {
      await requestDelete(seq);
      navigate(`/board/list`, { replace: true });
    } catch (error) {
      console.error('Error deleting board:', error);
      // 에러 처리
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

  return (
    <BoardViewForm
      boardData={boardData}
      onSubmit={onSubmit}
      onDelete={onDelete}
      form={form}
      onChange={onChange}
      currentUser={currentUser}
      commentList={commentList}
    />
  );
};

export default BoardViewContainer;
