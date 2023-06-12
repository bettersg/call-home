import React from 'react';
import { Navigate } from 'react-router-dom';
import { SceneProps } from 'scenes/types';
import PATHS, { useReadyUserState, isUserVerified } from 'scenes/paths';
import { useFeatureService } from 'contexts';
import VerifyPhoneNumber from './VerifyPhoneNumber';
import VerifyPhoneNumberCode from './VerifyPhoneNumberCode';
import VerifyDorm from './VerifyDorm';
import VerifyFin from './VerifyFin';
import VerifyWorkpass from './VerifyWorkpass';

function Verify({ locale, routePath }: SceneProps) {
  const userState = useReadyUserState();
  const [featureState] = useFeatureService();
  if (!userState || !featureState) {
    return null;
  }

  const user = userState.me;
  if (!user || isUserVerified(user, featureState)) {
    return <Navigate to={PATHS.HOME} replace />;
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
  if (featureState?.DORM_VALIDATION) {
    return <VerifyDorm locale={locale} routePath={routePath} />;
  }
  if (!featureState?.DISABLE_WORKPASS) {
    return <VerifyWorkpass locale={locale} routePath={routePath} />;
  }
  if (featureState?.ENABLE_FIN) {
    return <VerifyFin locale={locale} routePath={routePath} />;
  }
  // We've misconfigured something. Give up and show the generic error page..
  throw Error('Internal error');
}

export default Verify;
