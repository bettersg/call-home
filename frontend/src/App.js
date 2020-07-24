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
        try {
          const error = event.reason;
          scope.setExtra('error', error);
          scope.setExtra('errorBody', JSON.stringify(error, null, 2));
        } finally {
          Sentry.captureMessage('Unhandled promise rejection');
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
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      try {
        scope.setExtra('error', error);
        scope.setExtra('errorBody', JSON.stringify(error, null, 2));
        scope.setExtra('errorInfo', JSON.stringify(errorInfo, null, 2));
      } finally {
        Sentry.captureMessage('Error ui displayed');
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
