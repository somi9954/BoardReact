import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import MemberListForm from '../../components/member/MemberListForm';
import responseList from '../../api/member/MemberList';
import {
  requestMemberDelete,
  requestMemberTypeUpdate,
} from '../../api/member/AdminMember';

const MemberListContainer = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [originMembers, setOriginMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [searchOption, setSearchOption] = useState('all');

  const loadMembers = useCallback(() => {
    setLoading(true);
    responseList()
      .then((data) => {
        setMembers(data);
        setOriginMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(t('Failed to load member list: ') + err);
        setLoading(false);
      });
  }, [t]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  if (loading) {
    return <div>{t('Loading...')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const searchMemberList = () => {
    const filteredList = originMembers.filter((item) => {
      if (searchOption === 'all') {
        return (
          (item.email && item.email.includes(searchKey)) ||
          (item.nickname && item.nickname.includes(searchKey))
        );
      } else if (searchOption === 'email') {
        return item.email && item.email.includes(searchKey);
      } else if (searchOption === 'nickname') {
        return item.nickname && item.nickname.includes(searchKey);
      }
      return false;
    });

    setMembers(filteredList);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKey(value);

    if (!value.trim()) {
      setMembers(originMembers);
    }
  };

  const handleSearchOptionChange = (e) => {
    setSearchOption(e.target.value);
  };

  const handleSearchSubmit = () => {
    searchMemberList();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMemberList();
    }
  };

  const handleTypeChange = async (userNo, type) => {
    try {
      const res = await requestMemberTypeUpdate(userNo, type);
      if (res.data?.success === false) {
        alert(res.data?.message || '권한 변경에 실패했습니다.');
        return;
      }

      loadMembers();
    } catch (err) {
      const message = err?.response?.data?.message || '권한 변경 중 오류가 발생했습니다.';
      alert(message);
    }
  };

  const handleDelete = async (userNo) => {
    const confirmed = window.confirm('정말 탈퇴 처리하시겠습니까? 탈퇴 회원은 30일 후 자동 삭제됩니다.');
    if (!confirmed) return;

    try {
      const res = await requestMemberDelete(userNo);
      if (res.data?.success === false) {
        alert(res.data?.message || '탈퇴 처리에 실패했습니다.');
        return;
      }

      loadMembers();
    } catch (err) {
      alert('탈퇴 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <MemberListForm
      members={members}
      searchMemberList={searchMemberList}
      searchKey={searchKey}
      handleSearchChange={handleSearchChange}
      searchOption={searchOption}
      handleSearchOptionChange={handleSearchOptionChange}
      handleSearchSubmit={handleSearchSubmit}
      handleKeyPress={handleKeyPress}
      handleTypeChange={handleTypeChange}
      handleDelete={handleDelete}
    />
  );
};

export default MemberListContainer;
