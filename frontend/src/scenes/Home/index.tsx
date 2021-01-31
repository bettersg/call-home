import React from 'react';
import { Redirect } from 'react-router-dom';
import { SceneProps } from 'scenes/types';
import PATHS, { useReadyUserState, isUserVerified } from 'scenes/paths';
import Login from './Login';
import ContactsPage from './ContactsPage';

function Home({ locale, routePath }: SceneProps) {
  const userState = useReadyUserState();
  if (!userState) {
    return null;
  }

  const user = userState.me;
  if (!user) {
    return <Login locale={locale} routePath={routePath} />;
  }

  if (!isUserVerified(user)) {
    return <Redirect to={PATHS.VERIFY} />;
  }
  return <ContactsPage locale={locale} routePath={routePath} />;
}

export default Home;
