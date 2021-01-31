import { UserWalletResponse } from '@call-home/shared/types/User';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useUserService } from '../contexts';
import { UserState } from '../services';

enum PATHS {
  HOME = '/',
  ADMIN = '/admin',
  CALLING = '/call',
  TRANSACTIONS = '/transactions',
  RECENT_CALLS = '/recent-calls',
  PROMO_CODE = '/promo-code',
  VERIFY = '/verify',
}

function isUserVerified(user: UserWalletResponse): boolean {
  if (user.verificationState.adminGranted) {
    return true;
  }
  return user.verificationState.phoneNumber && user.verificationState.workpass;
}

function routeFromState(userState: UserState): string | null {
  // If there is no user, the user is not logged in and should be directed to home.
  if (!userState.me) {
    return PATHS.HOME;
  }

  if (!isUserVerified(userState.me)) {
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
  // const [featureState, featureService] = useFeatureService();
  // const [featureRequestInFlight, setFeatureRequestInFlight] = useState(true);

  // useEffect(() => {
  //   if (featureService) {
  //     featureService
  //       .refreshFeatures()
  //       .finally(() => setFeatureRequestInFlight(false));
  //   }
  // }, [featureService]);

  // if (featureRequestInFlight === true) {
  //   return {
  //     ready: false,
  //   };
  // }

  const userState = useReadyUserState();
  if (!userState) {
    return {
      ready: false,
    };
  }

  const route = routeFromState(userState);
  if (route && route !== ownRoute) {
    return {
      ready: true,
      renderElement: <Redirect to={route} />,
    };
  }

  return { ready: true };
}

export { isUserVerified, useAuthRouting, useReadyUserState };
export default PATHS;
