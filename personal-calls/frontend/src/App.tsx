import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import * as Sentry from '@sentry/react';
import {
  AdminServiceProvider,
  AllowlistServiceProvider,
  FeatureServiceProvider,
  UserServiceProvider,
  ContactServiceProvider,
  DormServiceProvider,
  RedeemableCodeServiceProvider,
  ThemeProvider,
  useUserService,
  useFeatureService,
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
  const { me: user } = userState || {};

  useEffect(() => {
    const listener = (event: Event) => {
      // We used to report every uncaught exception to Sentry, but that proved too noisy. This should leave breadcrumbs in the event that the event is sent to Sentry.
      console.error(event);
    };
    window.addEventListener('unhandledrejection', listener);
    return () => window.removeEventListener('unhandledrejection', listener);
  }, []);

  useEffect(() => {
    if (userService && isProd) {
      (userService as any).refreshSelf();
    }
  }, [userService]);

  useEffect(() => {
    if (user) {
      configureUser(user);
    }
  }, [user]);

  // Feature service stuff
  const [featureState, featureService] = useFeatureService();
  const [featureRequestInFlight, setFeatureRequestInFlight] = useState(true);
  useEffect(() => {
    if (featureService) {
      featureService
        .refreshFeatures()
        .finally(() => setFeatureRequestInFlight(false));
    }
  }, [featureService]);

  if (featureRequestInFlight === true || !featureState) {
    return null;
  }
  // End feature service stuff

  return <SceneRouter />;
}

class ErrorBoundary extends React.Component<any> {
  state: {
    error: Error | null;
  };

  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
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
    <AdminServiceProvider>
      <RedeemableCodeServiceProvider>
        <DormServiceProvider>
          <AllowlistServiceProvider>
            <UserServiceProvider>
              <ContactServiceProvider>
                <FeatureServiceProvider>
                  <ThemeProvider>
                    <ErrorBoundary>
                      <InitApp />
                    </ErrorBoundary>
                    <CssBaseline />
                  </ThemeProvider>
                </FeatureServiceProvider>
              </ContactServiceProvider>
            </UserServiceProvider>
          </AllowlistServiceProvider>
        </DormServiceProvider>
      </RedeemableCodeServiceProvider>
    </AdminServiceProvider>
  );
}

export default App;
