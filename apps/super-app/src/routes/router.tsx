import { Route, Routes } from 'react-router-dom';
import { Path } from './paths';
import { Options, LandingPage, SupportDetailPage } from '.';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={Path.Home} element={<LandingPage />}></Route>
      <Route path={Path.LandingPage} element={<LandingPage />}></Route>
      <Route
        path={`${Path.SupportDetail}/:partner`}
        element={<SupportDetailPage />}
      ></Route>

      <Route path={Path.Options} element={<Options />}></Route>
    </Routes>
  );
}
