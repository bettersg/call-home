import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  AllowlistServiceProvider,
  UserServiceProvider,
  ContactServiceProvider,
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
    <AllowlistServiceProvider>
      <UserServiceProvider>
        <ContactServiceProvider>
          <ThemeProvider>
            <SceneRouter />
            <CssBaseline />
          </ThemeProvider>
        </ContactServiceProvider>
      </UserServiceProvider>
    </AllowlistServiceProvider>
  );
}

export default App;
