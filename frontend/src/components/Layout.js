import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import UserInfo from './UserInfo';
import Dashboard from './Dashboard';

import { useUserService } from '../contexts';

function Layout() {
  const [dashboardChoice, setDashboardChoice] = useState(null);
  const [userState] = useUserService();
  const { me: userInfo } = userState;
  useEffect(() => {
    if (userInfo) {
      setDashboardChoice(userInfo.role);
    }
  }, [userInfo]);

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography component="h1" variant="h6">
            Care Corner-Ring a Senior
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container className="main-container">
        <Grid justify="center" container spacing={2}>
          <UserInfo dashboardChoice={dashboardChoice} />
          <Dashboard userInfo={userInfo} dashboardChoice={dashboardChoice} />
        </Grid>
      </Container>
    </>
  );
}

export default Layout;
