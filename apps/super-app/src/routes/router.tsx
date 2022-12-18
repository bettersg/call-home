import { Route, Routes, Link } from 'react-router-dom';
import { Path } from './paths';
import { Options, Scratch, Support, SupportDetailWip } from '.';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={Path.Home}
        element={<Link to={Path.Scratch}>TODO</Link>}
      ></Route>
      <Route path={Path.Scratch} element={<Scratch />}></Route>
      <Route path={Path.SupportDetail} element={<SupportDetailWip />}></Route>

      <Route path={Path.Support} element={<Support />}></Route>
      <Route path={Path.Options} element={<Options />}></Route>
    </Routes>
  );
}
