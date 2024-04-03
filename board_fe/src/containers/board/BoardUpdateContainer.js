import React, { useCallback, useEffect, useState } from 'react';
import responseView from '../../api/board/boardView';
import responseUpdate from '../../api/board/BoardUpdate';
import BoardUpdateForm from '../../components/board/BoardUpdateForm';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../api/member/Login';

const BoardUpdateContainer = () => {
  const [boardData, setBoardData] = useState(null);
  const [form, setForm] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // URL에서 시퀀스 가져오는 함수
  const getSeqFromURL = () => {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1];
  };

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    getUserInfo()
      .then((userInfo) => setUserInfo(userInfo))
      .catch((error) => console.error('사용자 정보 가져오기 오류:', error));
  }, []);

  // 컴포넌트 마운트 시 게시판 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const seq = getSeqFromURL();
        if (seq !== undefined) {
          const responseData = await responseView(seq);
          setBoardData(responseData.data);
          setForm(responseData.data);
        }
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    };
    fetchData();
  }, []);

  // boardData 변경 시 form 상태 업데이트
  useEffect(() => {
    if (boardData && boardData.board && boardData.board.category) {
      const categories = boardData.board.category.split('\n');
      if (categories.length > 0) {
        const selectedCategory =
          categories.find((cat) => cat === boardData.category) || categories[0];
        setForm((prevForm) => ({
          ...prevForm,
          category: selectedCategory,
        }));
      }
    }
  }, [boardData]);

  // 폼 제출 핸들러
  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const seq = getSeqFromURL();
      try {
        const updatedData = { ...boardData, ...form };
        await responseUpdate(seq, updatedData);
        navigate(`/board/view/${seq}`, { replace: true });
      } catch (error) {
        console.error('데이터 업데이트 오류:', error);
        setErrors(() => error.message);
      }
    },
    [boardData, form, navigate],
  );

  // 폼 입력 변경 핸들러
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // 에디터 내용 변경 핸들러
  const handleEditorChange = useCallback((content) => {
    setForm((prevForm) => ({
      ...prevForm,
      content: content,
    }));
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      {boardData && userInfo && (
        <BoardUpdateForm
          initialValues={boardData}
          form={form}
          onSubmit={onSubmit}
          onChange={onChange}
          handleEditorChange={handleEditorChange}
          userInfo={userInfo}
          handleGoBack={handleGoBack}
        />
      )}
    </div>
  );
};

export default BoardUpdateContainer;
