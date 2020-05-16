import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { UserServiceProvider, CalleeServiceProvider } from './contexts';
import { initSentry } from './services/Sentry';
import { Layout } from './components';

const isProd = window.NODE_ENV === 'production';
if (isProd) {
  initSentry();
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
