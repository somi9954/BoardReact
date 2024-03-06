import React from 'react';
import styled from 'styled-components';
import banner from '../../images/4281689.jpg';

const BannerBox = styled.img`
    width: 1000px;
    height: 200px; 
    object-fit: cover; 
    padding-top: 20px;
`;

const Banner = () => {
  return (
    <BannerBox src={banner} className="banner" alt="배너" />
  );
};

export default Banner;
