import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';

import UserInfo from './components/UserInfo';
import AdminDashboard from './components/AdminDashboard';
import CallerDashboard from './components/CallerDashboard';
import { getSelf, UserTypes } from './services/Users';
import * as Sentry from '@sentry/browser';
import './App.css';

// TODO this should probably be injected via env
Sentry.init({dsn: "https://1a5285e10558497d9484dfa1f09ecdab@o384207.ingest.sentry.io/5215064"});
console.log('sentry initted')

function Dashboard({ userInfo, dashboardChoice }) {
  if (!userInfo) {
    return null;
  }
  if (
    userInfo.role === UserTypes.ADMIN &&
    dashboardChoice === UserTypes.ADMIN
  ) {
    return <AdminDashboard userInfo={userInfo} />;
  }
  return <CallerDashboard userInfo={userInfo} />;
}

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [dashboardChoice, setDashboardChoice] = useState(null);

  useEffect(() => {
    (async () => {
      const myInfo = await getSelf();
      setUserInfo(myInfo);
      setDashboardChoice(myInfo.role);
    })();
  }, []);

  return (
    <>
      <CssBaseline />
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
          <UserInfo
            userInfo={userInfo}
            toggleDashboardChoice={() => {
              if (dashboardChoice === UserTypes.ADMIN) {
                setDashboardChoice(UserTypes.CALLER);
              } else {
                setDashboardChoice(UserTypes.ADMIN);
              }
            }}
          />
          <Dashboard userInfo={userInfo} dashboardChoice={dashboardChoice} />
        </Grid>
      </Container>
    </>
  );
}

export default App;
