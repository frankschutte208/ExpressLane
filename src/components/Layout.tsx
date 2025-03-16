import React from 'react';
import { Box, AppBar, Toolbar, Typography, Tabs, Tab, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import FloatingLogo from './FloatingLogo';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#003087', // Liberty's primary dark blue
  position: 'static',
  height: '60px',
});

const StyledToolbar = styled(Toolbar)({
  height: '100%',
  justifyContent: 'space-between',
  padding: '0 20px',
});

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const Logo = styled('img')({
  height: '40px',
  width: 'auto',
});

const AppTitle = styled(Typography)({
  fontFamily: '"DIN Next Pro Bold", Arial, Helvetica, sans-serif',
  fontSize: '24px',
  fontWeight: 700,
  color: '#FFFFFF',
});

const NavigationTabs = styled(Tabs)({
  backgroundColor: '#FFFFFF',
  borderTop: '1px solid #D3D3D3',
  borderBottom: '1px solid #D3D3D3',
  '& .MuiTabs-indicator': {
    backgroundColor: '#00A9E0', // Liberty's light blue
    height: '2px',
  },
});

const StyledTab = styled(Tab)({
  fontFamily: '"DIN Next Pro Regular", Arial, Helvetica, sans-serif',
  fontSize: '16px',
  fontWeight: 400,
  color: '#333333',
  '&.Mui-selected': {
    fontWeight: 700,
    color: '#333333',
  },
});

const ContentArea = styled(Box)({
  backgroundColor: '#F5F6F5',
  border: '1px solid #D3D3D3',
  padding: '20px',
  minHeight: 'calc(100vh - 100px)', // 100px accounts for header and tabs
});

interface LayoutProps {
  children: React.ReactNode;
  currentTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentTab, onTabChange }) => {
  return (
    <Box sx={{ backgroundColor: '#808080', minHeight: '100vh' }}>
      <StyledAppBar>
        <StyledToolbar>
          <AppTitle>
            Express Lane Underwriting - <span style={{ color: '#FDB813' }}>Prototype</span>
          </AppTitle>
          <LogoContainer>
            <Logo 
              src="/logo-main.png" 
              alt="Liberty Standard Bank Logo"
            />
          </LogoContainer>
        </StyledToolbar>
      </StyledAppBar>

      <Container sx={{ maxWidth: '1800px !important' }}>
        <NavigationTabs
          value={currentTab}
          onChange={onTabChange}
          centered
        >
          <StyledTab label="Questions" />
          <StyledTab label="Underwriting Models" />
          <StyledTab label="Simulator" />
        </NavigationTabs>

        <ContentArea>
          {children}
        </ContentArea>
      </Container>
      <FloatingLogo />
    </Box>
  );
};

export default Layout; 