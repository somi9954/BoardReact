import React, { useEffect, useState, useCallback } from 'react';
import BoardViewForm from '../../components/board/BoardViewForm';
import responseView from '../../api/board/boardView';
import requestCommentWrite from '../../api/Comment/CommentWrite';
import responseCommentList from '../../api/Comment/CommentList';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../api/member/Login';
import { produce } from 'immer';

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
        if (seq !== undefined) {
          const responseData = await responseView(seq); // seq를 전달하여 데이터 가져오기
          setBoardData(responseData); // 가져온 데이터 설정
          console.log('Data fetched successfully:', responseData); // 데이터 확인을 위해 콘솔에 출력
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
    async (e) => {
      e.preventDefault();

      const requiredFields = {
        content: t('NotBlank_content'),
      };
      const _errors = {};
      let hasError = false;
      for (const field in requiredFields) {
        if (!form[field] || !form[field].trim()) {
          _errors[field] = _errors[field] || [];
          _errors[field].push(requiredFields[field]);
          hasError = true;
        }
      }

      if (hasError) {
        setErrors((errors) => _errors);
        return;
      }

      const seq = getSeqFromURL(); // 여기서 게시글의 식별자를 가져오는 함수를 호출하여 seq를 가져옵니다.
      const formData = {
        ...form,
        poster: currentUser || form.poster || '',
        boardDataSeq: seq, // 댓글을 작성하는데 필요한 게시글의 식별자를 전달합니다.
      };

      try {
        await requestCommentWrite(formData);
        navigate(`/board/view/${seq}`, { replace: true });
      } catch (error) {
        console.error('Error adding comment:', error);
        setErrors(() => error.message);
      }
    },
    [form, t, navigate, currentUser],
  );

  const getSeqFromURL = () => {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1];
  };

  const onChange = useCallback((e) => {
    const target = e.currentTarget;
    setForm(
      produce((draft) => {
        draft[target.name] = target.value;
      }),
    );
  }, []);

  return (
    <BoardViewForm
      boardData={boardData}
      onSubmit={onSubmit}
      form={form}
      onChange={onChange}
      currentUser={currentUser}
      commentList={commentList}
    />
  );
};

export default BoardViewContainer;
