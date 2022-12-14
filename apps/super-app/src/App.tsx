import './App.css';
import { useEffect } from 'react';
import { consoleSmokeTest } from './services';
import { ThemeProvider } from './common/contexts';
import { AppRoutes } from './routes/router';

function App() {
  useEffect(() => {
    consoleSmokeTest();
  }, []);

  return (
    <ThemeProvider>
      <AppRoutes></AppRoutes>
    </ThemeProvider>
  );
}

export default App;
