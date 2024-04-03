import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BoardForm from '../../components/board/BoardForm';
import requestWrite from '../../api/board/boardWrite';
import apiRequest from '../../lib/apiRequest';
import { getUserInfo } from '../../api/member/Login';
import responseList from '../../api/board/BoardList';
import responseUpdate from '../../api/board/BoardUpdate';

const BoardWriteContainer = () => {
  const navigate = useNavigate();
  const { bId } = useParams();
  const [form, setForm] = useState({ bId: bId });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (bId) {
          const response = await apiRequest(
            `/admin/board/list?bId=${bId}`,
            'GET',
          );
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
        }
      } catch (error) {
        console.error('Error fetching board list:', error);
        setErrors({ message: error });
      }
    };

    fetchData();

    getUserInfo()
      .then((loggedInUser) => {
        setUser(loggedInUser);
      })
      .catch((error) => {
        console.error('Error fetching user info:', error);
      });
  }, [bId]);

  const fetchLatestSeqAndNavigate = async () => {
    try {
      const latestResponse = await responseList(bId); // 게시판의 최신 글 목록을 가져옴
      console.log(latestResponse);
      const latestSeq = latestResponse.data[0].seq; // 최신 글의 seq
      console.log(latestSeq);
      navigate(`/board/view/${latestSeq}`, { replace: true }); // 최신 게시글로 이동
    } catch (error) {
      console.error('Error fetching latest seq and navigating:', error);
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
      // 수정할 게시글의 시퀀스 번호
      const seqToUpdate = form.seq;
      // 게시글 수정 요청
      await responseUpdate(seqToUpdate, form);
      // 수정 요청이 성공하면 최신 글의 시퀀스를 가져와서 해당 글로 이동
      fetchLatestSeqAndNavigate();
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
      form={form}
      categories={categories}
      handleEditorChange={handleEditorChange}
      user={user}
      showPasswordField={showPasswordField}
      errors={errors}
    />
  );
};

export default BoardWriteContainer;
