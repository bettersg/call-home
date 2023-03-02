import { Route, Routes } from 'react-router-dom';
import { Path } from './paths';
import { Options, Support, LandingPage, SupportDetailWip } from '.';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={Path.Home} element={<LandingPage />}></Route>
      <Route path={Path.LandingPage} element={<LandingPage />}></Route>
      <Route path={Path.SupportDetail} element={<SupportDetailWip />}></Route>

      <Route path={Path.Support} element={<Support />}></Route>
      <Route path={Path.Options} element={<Options />}></Route>
    </Routes>
  );
}
