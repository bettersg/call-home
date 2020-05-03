import { createContext, useContext, useEffect, useState } from 'react';

export const UserServiceContext = createContext(null);

export function useUserService() {
  const userService = useContext(UserServiceContext);
  const [userState, setUserState] = useState(userService.state);
  useEffect(() => {
    if (userService) {
      userService.subscribe(setUserState);
    }
  }, [userService]);
  return [userState, userService];
}
