import { Route, Routes } from 'react-router-dom';
import { Path } from './paths';
import { Options, LandingPage } from '../components';
import { SupportDetailPage } from '../common/components';
import { getTwc2Detail } from '../services';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={Path.Home} element={<LandingPage />}></Route>
      <Route path={Path.SupportDetail} element={<SupportDetailPage getServiceDetailFunction={getTwc2Detail} />}></Route>

      <Route path={Path.Options} element={<Options />}></Route>
    </Routes>
  );
}
