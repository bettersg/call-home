import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as UserService } from '../services';

const UserServiceContext = createContext(null);
const UserStateContext = createContext(null);

const userService = new UserService();

export function UserServiceProvider({ children }) {
  const [userState, setUserState] = useState({});

  useEffect(() => {
    if (userService) {
      userService.subscribe(setUserState);
    }
  }, []);
  return (
    <UserServiceContext.Provider value={userService}>
      <UserStateContext.Provider value={userState}>
        {children}
      </UserStateContext.Provider>
    </UserServiceContext.Provider>
  );
}

export function useUserService() {
  const innerUserService = useContext(UserServiceContext);
  const userState = useContext(UserStateContext);
  return [userState, innerUserService];
}
