import './App.css';
import { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { consoleSmokeTest } from './services';
import { ThemeProvider } from './common/contexts';
import { AppRoutes } from './routes/router';

function App() {
  useEffect(() => {
    consoleSmokeTest();
  }, []);

  return (
    <ThemeProvider>
      <CssBaseline />
      <AppRoutes></AppRoutes>
    </ThemeProvider>
  );
}

export default App;
