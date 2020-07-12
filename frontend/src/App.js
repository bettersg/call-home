import React, { useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  AllowlistServiceProvider,
  UserServiceProvider,
  ContactServiceProvider,
  ThemeProvider,
  useUserService,
} from './contexts';
import { initSentry, configureUser } from './services/Sentry';
import SceneRouter from './scenes/SceneRouter';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  initSentry();
  console.log('sentry initted');
}

function InitApp() {
  const [userState, userService] = useUserService();
  const { me: user } = userState;

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

function App() {
  return (
    <AllowlistServiceProvider>
      <UserServiceProvider>
        <ContactServiceProvider>
          <ThemeProvider>
            <InitApp />
            <CssBaseline />
          </ThemeProvider>
        </ContactServiceProvider>
      </UserServiceProvider>
    </AllowlistServiceProvider>
  );
}

export default App;
