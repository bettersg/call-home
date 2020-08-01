import React, { useEffect } from 'react';
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
}

function InitApp() {
  const [userState, userService] = useUserService();
  const { me: user } = userState;

  useEffect(() => {
    const listener = (event) => {
      Sentry.withScope((scope) => {
        const error = event.reason;
        try {
          scope.setExtra('error', error);
          scope.setExtra('errorBody', JSON.stringify(error, null, 2));
        } finally {
          Sentry.captureMessage('Unhandled promise rejection');
          Sentry.captureException(error);
        }
      });
    };
    window.addEventListener('unhandledrejection', listener);
    return () => window.removeEventListener('unhandledrejection', listener);
  }, []);

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

  return <SceneRouter />;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;
    if (error) {
      // Pass this down so that the scene can decide whether or not the error needs to be reported
      const reportError = () => {
        Sentry.withScope((scope) => {
          try {
            scope.setExtra('error', error);
            scope.setExtra('errorBody', JSON.stringify(error, null, 2));
          } finally {
            Sentry.captureMessage('Error ui displayed');
          }
        });
      };
      return <ErrorScene reportError={reportError} error={error} />;
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
