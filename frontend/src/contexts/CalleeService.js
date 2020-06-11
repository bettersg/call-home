import React, { createContext, useContext, useEffect, useState } from 'react';
import { Callee as CalleeService } from '../services';

const CalleeServiceContext = createContext(null);
const CalleeStateContext = createContext(null);

const calleeService = new CalleeService();

export function CalleeServiceProvider({ children }) {
  const [calleeState, setCalleeState] = useState({});

  useEffect(() => {
    if (calleeService) {
      calleeService.subscribe(setCalleeState);
      /* calleeService.refreshAllCallees().catch(e => alert(e)); */
    }
  }, [calleeService]);

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
