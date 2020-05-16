import React from 'react';
import * as Sentry from '@sentry/browser';
import CssBaseline from '@material-ui/core/CssBaseline';
import { UserServiceProvider, CalleeServiceProvider } from './contexts';
// TODO this export is probably misplaced
import { Layout } from './components';

// TODO this should probably be injected via env
if (window.NODE_ENV === 'production') {
  Sentry.init({
    dsn:
      'https://311e61bcb9f24ab7b601e085cce9eb6d@o386666.ingest.sentry.io/5221206',
  });
  console.log('sentry initted');
}

function AppContent({ errorMessage }) {
  // if we encounter an error, we stop using the background services
  if (errorMessage) {
    return (
      <>
        <CssBaseline />
        <Layout errorMessage={errorMessage} />
      </>
    );
  }

  return (
    <UserServiceProvider>
      <CalleeServiceProvider>
        <CssBaseline />
        <Layout errorMessage={errorMessage} />
      </CalleeServiceProvider>
    </UserServiceProvider>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: undefined,
    };
  }

  static getDerivedStateFromError(e) {
    return { errorMessage: e.message };
  }

  render() {
    const { errorMessage } = this.state;
    return <AppContent errorMessage={errorMessage} />;
  }
}

export default App;
