import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
    text-align: center;
    background-color: #ff4910;
    width: 100%;
    h1 {
        color: #fff;
    }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <h1>푸터</h1>
    </FooterContainer>
  );
};

export default Footer;
