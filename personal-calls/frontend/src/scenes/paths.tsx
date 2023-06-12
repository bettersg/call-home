import { UserWalletResponse } from '@call-home/shared/types/User';
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserService, useFeatureService } from '../contexts';
import { UserState, FeatureState } from '../services';

enum PATHS {
  HOME = '/',
  ADMIN = '/admin',
  CALLING = '/call',
  TRANSACTIONS = '/transactions',
  RECENT_CALLS = '/recent-calls',
  PROMO_CODE = '/promo-code',
  VERIFY = '/verify',
}

function isUserVerified(
  user: UserWalletResponse,
  featureState: FeatureState
): boolean {
  if (user.verificationState.adminGranted) {
    return true;
  }
  let isVerified = true;
  isVerified = isVerified && user.verificationState.phoneNumber;
  if (!featureState.DISABLE_WORKPASS) {
    isVerified = isVerified && user.verificationState.workpass;
  }
  if (featureState.ENABLE_FIN) {
    isVerified = isVerified && user.verificationState.fin;
  }
  if (featureState.DORM_VALIDATION) {
    isVerified = isVerified && user.verificationState.dorm;
  }
  return isVerified;
}

function routeFromState(
  userState: UserState,
  featureState: FeatureState
): string | null {
  // If there is no user, the user is not logged in and should be directed to home.
  if (!userState.me) {
    return PATHS.HOME;
  }

  if (!isUserVerified(userState.me, featureState)) {
    return PATHS.VERIFY;
  }

  return null;
}

function useReadyUserState(): UserState | null {
  const [userState, userService] = useUserService();
  const [userRequestInFlight, setUserRequestInFlight] = useState(true);

  useEffect(() => {
    if (userService) {
      (userService as any)
        .refreshSelf()
        .finally(() => setUserRequestInFlight(false));
    }
  }, [userService]);

  if (userRequestInFlight) {
    return null;
  }

  return userState;
}

interface RoutingResult {
  ready: boolean;
  renderElement?: JSX.Element;
}

function useAuthRouting(ownRoute: string): RoutingResult {
  // Uncomment if feature state is needed
  const [featureState, featureService] = useFeatureService();
  const [featureRequestInFlight, setFeatureRequestInFlight] = useState(true);
  const userState = useReadyUserState();

  useEffect(() => {
    if (featureService) {
      featureService
        .refreshFeatures()
        .finally(() => setFeatureRequestInFlight(false));
    }
  }, [featureService]);

  if (featureRequestInFlight === true || !featureState) {
    return {
      ready: false,
    };
  }

  if (!userState) {
    return {
      ready: false,
    };
  }

  const route = routeFromState(userState, featureState);
  if (route && route !== ownRoute) {
    return {
      ready: true,
      renderElement: <Navigate to={route} replace />,
    };
  }

  return { ready: true };
}

export { isUserVerified, useAuthRouting, useReadyUserState };
export default PATHS;
