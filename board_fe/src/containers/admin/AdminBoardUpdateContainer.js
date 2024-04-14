import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfigBoardUpdateForm from '../../components/board/admin/ConfigBoardUpdateForm';
import responseAdminList from '../../api/admin/AdminBoardList';
import RequestConfigWriteChange from '../../api/admin/ConfigBoardUpdate';
import apiRequest from '../../lib/apiRequest';

const AdminBoardUpdateContainer = () => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // URL에서 게시물의 ID 가져오기
  const getBoardIdFromURL = () => {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1];
  };

  // 컴포넌트 마운트 시 게시물 데이터 가져오기
  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const bId = getBoardIdFromURL();
        if (bId) {
          const response = await apiRequest('/admin/board/list', 'GET');
          const board = response.data.content.find((item) => item.bid === bId);
          if (board && board.bid === bId) {
            // 추가된 부분
            setForm({
              bId: board.bid,
              bName: board.bname,
              active: board.active,
              authority: board.authority,
              category: board.category,
            });
          } else {
            console.error('해당 게시판을 찾을 수 없습니다.');
          }
        }
      } catch (error) {
        console.error('게시물 데이터 가져오기 오류:', error);
      }
    };
    fetchBoardData();
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const bId = getBoardIdFromURL();
      try {
        await RequestConfigWriteChange(bId, form);
        navigate(`/admin/board/list/`, { replace: true });
      } catch (error) {
        console.error('데이터 업데이트 오류:', error);
        setErrors(error.message);
      }
    },
    [form, navigate],
  );

  // 폼 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // 활성 상태 변경 핸들러
  const handleActiveChange = useCallback((active) => {
    setForm((prevForm) => ({
      ...prevForm,
      active,
    }));
  }, []);

  // 권한 변경 핸들러
  const handleAuthorityChange = useCallback((mode, authority) => {
    setForm((prevForm) => ({
      ...prevForm,
      authority:
        authority === 'ALL'
          ? 'ALL'
          : mode === 'add'
            ? authority
            : prevForm.authority,
    }));
  }, []);

  return (
    <ConfigBoardUpdateForm
      onSubmit={handleSubmit}
      onChange={handleInputChange}
      form={form}
      errors={errors}
      onActive={handleActiveChange}
      onAuthority={handleAuthorityChange}
    />
  );
};

export default React.memo(AdminBoardUpdateContainer);
