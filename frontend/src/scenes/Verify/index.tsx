import React from 'react';
import { Redirect } from 'react-router-dom';
import { SceneProps } from 'scenes/types';
import PATHS, { useReadyUserState, isUserVerified } from 'scenes/paths';
import VerifyPhoneNumber from './VerifyPhoneNumber';
import VerifyPhoneNumberCode from './VerifyPhoneNumberCode';
import VerifyWorkpass from './VerifyWorkpass';

function Verify({ locale, routePath }: SceneProps) {
  const userState = useReadyUserState();
  if (!userState) {
    return null;
  }

  const user = userState.me;
  if (!user || isUserVerified(user)) {
    return <Redirect to={PATHS.HOME} />;
  }

  // Verify phone number before work pass.
  if (!user.verificationState.phoneNumber) {
    // TODO this can probably be cleaned up further
    if (userState.verificationPhoneNumber) {
      return (
        <VerifyPhoneNumberCode
          phoneNumber={userState.verificationPhoneNumber}
          locale={locale}
          routePath={routePath}
        />
      );
    }
    return <VerifyPhoneNumber locale={locale} routePath={routePath} />;
  }

  return <VerifyWorkpass locale={locale} routePath={routePath} />;
}

export default Verify;
