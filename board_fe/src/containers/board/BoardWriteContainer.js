import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BoardForm from '../../components/board/BoardForm';
import requestWrite from '../../api/board/boardWrite';
import apiRequest from '../../lib/apiRequest';
import { getUserInfo } from '../../api/member/Login';

const BoardWriteContainer = () => {
  const navigate = useNavigate();
  const { bId } = useParams();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (bId) {
      fetchBoardList(bId);
    }
    getUserInfo()
      .then((loggedInUser) => {
        setUser(loggedInUser);
      })
      .catch((error) => {
        console.error('Error fetching user info:', error);
      });
  }, [bId]);

  const fetchBoardList = async (bId) => {
    try {
      const response = await apiRequest(`/admin/board/list?bId=${bId}`, 'GET');
      if (response.data && response.data.content) {
        const filteredBoards = response.data.content.filter(
          (board) => board.bid === bId,
        );
        const fetchedCategories = filteredBoards
          .map((board) => board.category.split('\n'))
          .flat();
        setCategories(fetchedCategories);
      } else {
        throw new Error('Failed to fetch board list.');
      }
    } catch (error) {
      console.error('Error fetching board list:', error);
      setErrors({ message: error });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // 내용이 비어 있는지 확인
      if (!form.content || form.content.trim() === '') {
        throw new Error('내용을 입력하세요.');
      }
      const formDataWithUser = { ...form, poster: user.nickname };
      const data = await requestWrite(formDataWithUser, bId); // bId를 requestWrite로 전달
      navigate(`/board/view/${data.seq}`, { replace: true });
      // 폼 재설정
      setForm({});
      setErrors({});
    } catch (error) {
      console.error('Error submitting:', error);
      setErrors({ message: error.message });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleEditorChange = (content) => {
    setForm((prevForm) => ({
      ...prevForm,
      content: content,
    }));
  };

  const showPasswordField = user ? false : true;

  return (
    <BoardForm
      onSubmit={onSubmit}
      onChange={handleChange}
      form={{ ...form, bId: bId }}
      categories={categories}
      handleEditorChange={handleEditorChange}
      user={user}
      showPasswordField={showPasswordField}
      errors={errors}
    />
  );
};

export default BoardWriteContainer;
