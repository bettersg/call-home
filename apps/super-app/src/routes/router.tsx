import { Route, Routes } from 'react-router-dom';
import { AppPath } from './paths';
import { Options, LandingPage } from '../components';
import { SupportDetailPage } from '../common/components';
import { getServiceCardDetails, ServiceCardDetail } from '../services';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={AppPath.Home} element={<LandingPage />}></Route>
      <Route path={AppPath.Options} element={<Options />}></Route>

      {/* Route through the different services and provide a separate page for each service */}
      {getServiceCardDetails('').map((serviceCardDetail: ServiceCardDetail) => (
        <Route
          path={serviceCardDetail.route}
          element={<SupportDetailPage partner={serviceCardDetail.route} />}
        ></Route>
      ))}
    </Routes>
  );
}
