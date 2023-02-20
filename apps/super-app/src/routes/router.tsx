import { Route, Routes } from 'react-router-dom';
import { Path } from './paths';
import { LandingPage, SupportDetailWip } from '.';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={Path.Home} element={<LandingPage />}></Route>
      <Route path={Path.LandingPage} element={<LandingPage />}></Route>
      <Route path={Path.SupportDetail} element={<SupportDetailWip />}></Route>
    </Routes>
  );
}
