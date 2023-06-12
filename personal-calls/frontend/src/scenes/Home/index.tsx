import React from 'react';
import { Navigate } from 'react-router-dom';
import { SceneProps } from 'scenes/types';
import PATHS, { useReadyUserState, isUserVerified } from 'scenes/paths';
import { useFeatureService } from 'contexts';
import Login from './Login';
import ContactsPage from './ContactsPage';

function Home({ locale, routePath }: SceneProps) {
  const userState = useReadyUserState();
  const [featureState] = useFeatureService();
  if (!userState || !featureState) {
    return null;
  }

  const user = userState.me;
  if (!user) {
    return <Login locale={locale} routePath={routePath} />;
  }

  if (!isUserVerified(user, featureState)) {
    return <Navigate to={PATHS.VERIFY} replace />;
  }
  return <ContactsPage locale={locale} routePath={routePath} />;
}

export default Home;
