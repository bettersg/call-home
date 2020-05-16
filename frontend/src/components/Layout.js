import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import UserInfo from './UserInfo';
import Dashboard from './Dashboard';
import TopAppBar from './TopAppBar';

import { useUserService } from '../contexts';

function ErrorContent({ errorMessage }) {
  return (
    <Paper>Sorry, something went wrong. Error Message: {errorMessage}</Paper>
  );
}

function Layout({ errorMessage }) {
  const [dashboardChoice, setDashboardChoice] = useState(null);
  const [userState] = useUserService();
  const { me: userInfo } = userState || {};
  useEffect(() => {
    if (userInfo) {
      setDashboardChoice(userInfo.role);
    }
  }, [userInfo]);

  const mainContent = errorMessage ? (
    <ErrorContent errorMessage={errorMessage} />
  ) : (
    <>
      <UserInfo dashboardChoice={dashboardChoice} />
      <Dashboard userInfo={userInfo} dashboardChoice={dashboardChoice} />
    </>
  );

  return (
    <>
      <TopAppBar
        dashboardChoice={dashboardChoice}
        setDashboardChoice={setDashboardChoice}
      />
      <Container className="main-container">
        <Grid justify="center" container spacing={2}>
          {mainContent}
        </Grid>
      </Container>
    </>
  );
}

export default Layout;
