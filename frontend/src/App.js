import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import * as Sentry from '@sentry/react';
import {
  AllowlistServiceProvider,
  UserServiceProvider,
  ContactServiceProvider,
  ThemeProvider,
  useUserService,
} from './contexts';
import { initSentry, configureUser } from './services/Sentry';
import SceneRouter from './scenes/SceneRouter';
import ErrorScene from './scenes/Error';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  initSentry();
  console.log('sentry initted');
}

function InitApp() {
  const [userState, userService] = useUserService();
  const [error, setError] = useState();
  const { me: user } = userState;

  useEffect(() => {
    const listener = (event) => {
      setError(event.reason);
    };
    // lmao if this works
    window.addEventListener('unhandledrejection', listener);
    return () => window.removeEventListener('unhandledrejection', listener);
  }, [setError]);

  useEffect(() => {
    if (userService && isProd) {
      userService.refreshSelf();
    }
  }, [userService]);

  useEffect(() => {
    if (user) {
      configureUser(user);
    }
  }, [user]);

  if (error) {
    throw error;
  }

  return <SceneRouter />;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      Sentry.captureMessage('Error ui displayed');
      try {
        scope.setExtra('error', error);
        scope.setExtra('errorBody', JSON.stringify(error, null, 2));
        scope.setExtra('errorInfo', JSON.stringify(errorInfo, null, 2));
      } finally {
        Sentry.captureMessage('Error ui displayed finally');
      }
    });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <ErrorScene />;
    }

    return children;
  }
}

function App() {
  return (
    <AllowlistServiceProvider>
      <UserServiceProvider>
        <ContactServiceProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <InitApp />
            </ErrorBoundary>
            <CssBaseline />
          </ThemeProvider>
        </ContactServiceProvider>
      </UserServiceProvider>
    </AllowlistServiceProvider>
  );
}

export default App;
