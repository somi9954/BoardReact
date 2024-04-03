import React, { useCallback, useEffect, useState } from 'react';
import responseView from '../../api/board/boardView';
import responseUpdate from '../../api/board/BoardUpdate';
import BoardUpdateForm from '../../components/board/BoardUpdateForm';
import { useNavigate } from 'react-router-dom';

const BoardUpdateContainer = () => {
  const [boardData, setBoardData] = useState(null);
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const getSeqFromURL = () => {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1];
  };

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

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleEditorChange = useCallback((content) => {
    setForm((prevForm) => ({
      ...prevForm,
      content: content,
    }));
  }, []);

  return (
    <div>
      {boardData && (
        <BoardUpdateForm
          initialValues={boardData}
          form={form}
          onSubmit={onSubmit}
          onChange={onChange}
          handleEditorChange={handleEditorChange}
        />
      )}
    </div>
  );
};

export default BoardUpdateContainer;
