import './App.css';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './common/contexts';
import {
  PrimaryButton,
  NeutralButton,
  ErrorButton,
} from './common/components/RoundedButton';
import CallHome from './components/CallHome';
import Support from './components/Support';
import More from './components/More';
import NavBar from './components/navbar/Navbar';

function App() {
  return (
    <ThemeProvider>
      <PrimaryButton>Primary</PrimaryButton>
      <NeutralButton>Neutral</NeutralButton>
      <ErrorButton>Error</ErrorButton>
      <NavBar />
      <Routes>
        <Route path="/callhome" element={<CallHome />}></Route>
        <Route path="/support" element={<Support />}></Route>
        <Route path="/more" element={<More />}></Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
