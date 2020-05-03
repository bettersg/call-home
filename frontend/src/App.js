import React, { useEffect, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';

import * as Sentry from '@sentry/browser';
import { UserInfo, AdminDashboard, CallerDashboard } from './components';
import {
  UserServiceContext,
  useUserService,
  CalleeServiceContext,
} from './contexts';
// TODO this export is probably misplaced
import { UserTypes } from './services/User';
import { User as UserService, Callee as CalleeService } from './services';
import './App.css';

// TODO this should probably be injected via env
if (window.NODE_ENV === 'production') {
  Sentry.init({
    dsn:
      'https://311e61bcb9f24ab7b601e085cce9eb6d@o386666.ingest.sentry.io/5221206',
  });
  console.log('sentry initted');
}

function Dashboard({ dashboardChoice, userInfo }) {
  if (!userInfo) {
    return null;
  }
  if (
    userInfo.role === UserTypes.ADMIN && dashboardChoice === UserTypes.ADMIN
  ) {
    return <AdminDashboard />;
  }
  return <CallerDashboard />;
}

function App() {
  const [dashboardChoice, setDashboardChoice] = useState(null);
  const [userState] = useUserService();
  const { me: userInfo } = userState;
  useEffect(() => {
    if (userInfo) {
      setDashboardChoice(userInfo.role)
    }
  }, [userInfo])

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

function AppProvider() {
  const userService = new UserService();
  // TODO could probably consolidate this into one method
  userService.refreshSelf();
  userService.refreshAllUsers();
  const calleeService = new CalleeService();
  calleeService.refreshAllCallees();
  return (
    <CalleeServiceContext.Provider value={calleeService}>
      <UserServiceContext.Provider value={userService}>
        <App />
      </UserServiceContext.Provider>
    </CalleeServiceContext.Provider>
  );
}

export default AppProvider;
