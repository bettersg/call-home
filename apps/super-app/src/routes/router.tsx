import { Route, Routes } from 'react-router-dom';
import { AppPath, ServicePath } from './paths';
import { Options, LandingPage } from '../components';
import { SupportDetailPage } from '../common/components';
import { getProBonoSGDetail, getTwc2Detail } from '../services';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={AppPath.Home} element={<LandingPage />}></Route>
      <Route path={AppPath.Options} element={<Options />}></Route>

      {/* Route through the different services and provide a separate page for each service */}
      <Route
        path={ServicePath.Twc2}
        element={<SupportDetailPage getServiceDetailFunction={getTwc2Detail} />}
      ></Route>
      <Route
        path={ServicePath.ProBonoSG}
        element={<SupportDetailPage getServiceDetailFunction={getProBonoSGDetail} />}
      ></Route>
    </Routes>
  );
}
