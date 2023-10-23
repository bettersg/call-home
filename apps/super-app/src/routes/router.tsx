import { Route, Routes } from 'react-router-dom';
import { Path } from './paths';
import { Options, LandingPage } from '../components';
import { SupportDetailPage } from '../common/components';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={Path.Home} element={<LandingPage />}></Route>
      <Route path={Path.SupportDetail} element={<SupportDetailPage />}></Route>

      <Route path={Path.Options} element={<Options />}></Route>
    </Routes>
  );
}
