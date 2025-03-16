import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import QuestionsView from './components/QuestionsView';
import SimulatorView from './components/SimulatorView';
import UnderwritingModelsView from './components/UnderwritingModelsView';
import theme from './styles/theme';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    switch (newValue) {
      case 0:
        navigate('/tables');
        break;
      case 1:
        navigate('/rules');
        break;
      case 2:
        navigate('/simulator');
        break;
    }
  };

  return (
    <Layout currentTab={currentTab} onTabChange={handleTabChange}>
      <Routes>
        <Route path="/tables" element={<QuestionsView />} />
        <Route path="/rules" element={<UnderwritingModelsView />} />
        <Route path="/simulator" element={<SimulatorView />} />
        <Route path="/" element={<QuestionsView />} />
      </Routes>
    </Layout>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  );
};

export default AppWrapper; 