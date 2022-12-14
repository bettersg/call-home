import './App.css';
import { useEffect } from 'react';
import { consoleSmokeTest } from './services';
import { ThemeProvider } from './common/contexts';
import { Container } from './common/components';
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
      <Container
        style={{
          background: 'no-repeat url(/images/background.svg) bottom center',
          backgroundSize: 'contain',
        }}
      >
        <PrimaryButton>Primary</PrimaryButton>
        <NeutralButton>Neutral</NeutralButton>
        <ErrorButton>Error</ErrorButton>
      </Container>
    </ThemeProvider>
  );
}

export default App;
