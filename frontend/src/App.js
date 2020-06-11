import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  UserServiceProvider,
  CalleeServiceProvider,
  ThemeProvider,
} from './contexts';
import { initSentry } from './services/Sentry';
import SceneRouter from './scenes/SceneRouter';

const isProd = window.NODE_ENV === 'production';
if (isProd) {
  initSentry();
  console.log('sentry initted');
}

function App() {
  return (
    <UserServiceProvider>
      <CalleeServiceProvider>
        <CssBaseline />
        <ThemeProvider>
          <SceneRouter />
        </ThemeProvider>
      </CalleeServiceProvider>
    </UserServiceProvider>
  );
}

export default App;
