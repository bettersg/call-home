import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { CircularProgress } from '@material-ui/core/CircularProgress';
import UserInfo from './UserInfo';
import Dashboard from './Dashboard';
import TopAppBar from './TopAppBar';

import { useUserService } from '../contexts';

function Layout() {
  const [dashboardChoice, setDashboardChoice] = useState(null);
  const [userState] = useUserService();
  const { me: userInfo } = userState || {};
  useEffect(() => {
    if (userInfo) {
      setDashboardChoice(userInfo.role);
    }
  }, [userInfo]);

  return userInfo == null ? (
    <CircularProgress />
  ) : (
    <>
      <TopAppBar
        dashboardChoice={dashboardChoice}
        setDashboardChoice={setDashboardChoice}
      />
      <Container className="main-container">
        <Grid justify="center" container>
          <UserInfo dashboardChoice={dashboardChoice} />
          <Dashboard userInfo={userInfo} dashboardChoice={dashboardChoice} />
        </Grid>
      </Container>
    </>
  );
}

export default Layout;
