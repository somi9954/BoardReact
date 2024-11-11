import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MemberListForm from '../../components/member/MemberListForm';
import responseList from '../../api/member/MemberList';

const MemberListContainer = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [searchOption, setSearchOption] = useState('all');

  useEffect(() => {
    responseList()
      .then((data) => {
        console.log('Members data:', data);
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(t('Failed to load member list: ') + err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>{t('Loading...')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const searchMemberList = () => {
    const filteredList = members.filter((item) => {
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
    setSearchKey(e.target.value);
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
    />
  );
};

export default MemberListContainer;
