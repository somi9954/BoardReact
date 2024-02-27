import React, { useContext } from 'react';
import UserContext from '../../modules/user';
import UnAuthorized from '../commons/UnAuthorized';

const AdminOnly = ({ children }) => {
  const {
    state: { isAdmin },
  } = useContext(UserContext);

  return isAdmin ? children : <UnAuthorized />;
};

export default AdminOnly;
