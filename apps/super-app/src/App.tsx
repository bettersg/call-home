import './App.css';
import { useEffect } from 'react';
import { consoleSmokeTest } from './services';
import { ThemeProvider } from './common/contexts';
import {
  PrimaryButton,
  NeutralButton,
  ErrorButton,
} from './common/components/RoundedButton';

function App() {
  useEffect(() => {
    consoleSmokeTest();
  }, []);
  return (
    <ThemeProvider>
      <PrimaryButton>Primary</PrimaryButton>
      <NeutralButton>Neutral</NeutralButton>
      <ErrorButton>Error</ErrorButton>
    </ThemeProvider>
  );
}

export default App;
