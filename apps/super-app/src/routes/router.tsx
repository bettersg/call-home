import { Route, Routes } from 'react-router-dom';
import { AppPath, ServicePath } from './paths';
import { Options, LandingPage } from '../components';
import { SupportDetailPage } from '../common/components';
import { getTwc2Detail } from '../services';

export function AppRoutes() {
  const serviceRoutes: string[] = Object.values(ServicePath);
  return (
    <Routes>
      <Route path={AppPath.Home} element={<LandingPage />}></Route>
      <Route path={AppPath.Options} element={<Options />}></Route>

      {/* Route through the different services and provide a separate page for each service */}
      {serviceRoutes.map((path) => (
        <Route
          path={path}
          element={
            <SupportDetailPage getServiceDetailFunction={getTwc2Detail} />
          }
        ></Route>
      ))}
    </Routes>
  );
}
