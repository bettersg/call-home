import './App.css';
import { ThemeProvider } from './common/contexts';
import {
  PrimaryButton,
  NeutralButton,
  ErrorButton,
} from './common/components/RoundedButton';

function App() {
  return (
    <ThemeProvider>
      <PrimaryButton>Primary</PrimaryButton>
      <NeutralButton>Neutral</NeutralButton>
      <ErrorButton>Error</ErrorButton>
    </ThemeProvider>
  );
}

export default App;
