import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const LogoContainer = styled(Box)({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1000,
  '& img': {
    width: '100px',
    height: 'auto',
    opacity: 0.8,
    transition: 'opacity 0.3s ease-in-out',
    '&:hover': {
      opacity: 1,
    }
  }
});

const FloatingLogo: React.FC = () => {
  return (
    <LogoContainer>
      <img src="/Mobi.png" alt="Mobi Logo" />
    </LogoContainer>
  );
};

export default FloatingLogo; 