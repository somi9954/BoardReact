import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardForm from '../../components/board/BoardForm';
import requestWrite from '../../api/board/boardWrite';

const BoardWriteContainer = ({ bId }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    requestWrite(form, bId) // bId도 함께 전달
      .then((data) => {
        console.log('작성 요청 성공:', data);
        setForm({}); // 폼 초기화
        navigate(`/board/view/${data.seq}`, { replace: true }); // 작성된 글 보기 페이지로 이동
      })
      .catch((error) => {
        console.error('작성 요청 오류:', error);
        setErrors({ message: error }); // 오류 메시지 설정
      });
  }, [form, bId, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }, []);

  const handleEditorChange = useCallback((content) => {
    setForm((prevForm) => ({
      ...prevForm,
      editorBody: content, // 에디터 내용을 form 상태의 editorBody 필드에 설정
    }));
  }, []);

  return (
    <BoardForm
      onSubmit={handleSubmit}
      onChange={handleChange}
      form={form}
      errors={errors}
      handleEditor={handleEditorChange}
    />
  );
};

export default BoardWriteContainer;
