import React from 'react';
import * as Sentry from '@sentry/browser';
import CssBaseline from '@material-ui/core/CssBaseline';
import { UserServiceContext, CalleeServiceContext } from './contexts';
// TODO this export is probably misplaced
import { User as UserService, Callee as CalleeService } from './services';
import { Layout } from './components';

// TODO this should probably be injected via env
if (window.NODE_ENV === 'production') {
  Sentry.init({
    dsn:
      'https://311e61bcb9f24ab7b601e085cce9eb6d@o386666.ingest.sentry.io/5221206',
  });
  console.log('sentry initted');
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
        <CssBaseline />
        <Layout />
      </UserServiceContext.Provider>
    </CalleeServiceContext.Provider>
  );
}

export default AppProvider;
