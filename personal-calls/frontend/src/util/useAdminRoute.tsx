import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useUserService } from '../contexts';
import PATHS from '../scenes/paths';

export default function useAdminRoute() {
  const [userRequestInFlight, setUserRequestInFlight] = useState(true);
  const [userState, userService] = useUserService();
  const { me: user } = userState || {};

  useEffect(() => {
    if (userService) {
      userService.refreshSelf().finally(() => setUserRequestInFlight(false));
    }
  }, [userService]);

  if (!user && !userRequestInFlight) {
    return <Redirect to={PATHS.HOME} />;
  }
  return null;
}
