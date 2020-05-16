import React, { createContext, useContext, useEffect, useState } from 'react';
import { Callee as CalleeService } from '../services';
import { useAsyncError } from '../hooks';

const CalleeServiceContext = createContext(null);
const CalleeStateContext = createContext(null);

const calleeService = new CalleeService();

export function CalleeServiceProvider({ children }) {
  const [calleeState, setCalleeState] = useState({});
  const throwError = useAsyncError();

  useEffect(() => {
    if (calleeService) {
      calleeService.subscribe(setCalleeState);
      calleeService.refreshAllCallees().catch(throwError);
    }
  }, [calleeService, throwError]);

  return (
    <CalleeServiceContext.Provider value={calleeService}>
      <CalleeStateContext.Provider value={calleeState}>
        {children}
      </CalleeStateContext.Provider>
    </CalleeServiceContext.Provider>
  );
}

export function useCalleeService() {
  const innerCalleeService = useContext(CalleeServiceContext);
  const calleeState = useContext(CalleeStateContext);
  return [calleeState, innerCalleeService];
}
