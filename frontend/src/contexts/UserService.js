import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as UserService } from '../services';

const UserServiceContext = createContext(null);
const UserStateContext = createContext(null);

export function UserServiceProvider({ children }) {
  const [userService] = useState(new UserService());
  const [userState, setUserState] = useState({});
  useEffect(() => {
    if (userService) {
      userService.subscribe(setUserState);
      userService.refreshSelf();
      // userService.refreshAllUsers();
    }
  }, [userService]);
  return (
    <UserServiceContext.Provider value={userService}>
      <UserStateContext.Provider value={userState}>
        {children}
      </UserStateContext.Provider>
    </UserServiceContext.Provider>
  );
}

export function useUserService() {
  const userService = useContext(UserServiceContext);
  const userState = useContext(UserStateContext);
  return [userState, userService];
}
