// BoardWriteContainer.js
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardForm from '../../components/board/BoardForm';
import requestWrite from '../../api/board/boardWrite';

const BoardWriteContainer = ({ bId, initialCategories }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState(initialCategories); // 초기 카테고리로 카테고리 초기화

  useEffect(() => {
    setCategories(initialCategories); // 초기 카테고리 변경 시 카테고리 업데이트
  }, [initialCategories]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      requestWrite(form, bId)
        .then((data) => {
          console.log('작성 요청 성공:', data);
          setForm({});
          navigate(`/board/view/${data.seq}`, { replace: true });
        })
        .catch((error) => {
          console.error('작성 요청 오류:', error);
          setErrors({ message: error });
        });
    },
    [form, bId, navigate],
  );

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
      editorBody: content,
    }));
  }, []);

  return (
    <BoardForm
      onSubmit={handleSubmit}
      onChange={handleChange}
      form={form}
      errors={errors}
      categories={categories} // 카테고리를 BoardForm에 전달
      handleEditor={handleEditorChange}
    />
  );
};

export default BoardWriteContainer;
