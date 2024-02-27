import React from 'react';

const ErrorMessage = ({ error }) => {
  return <h1>{error.message}</h1>;
};

export default React.memo(ErrorMessage);
