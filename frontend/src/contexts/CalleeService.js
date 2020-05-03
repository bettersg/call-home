import { createContext, useContext, useEffect, useState } from 'react';

export const CalleeServiceContext = createContext(null);

export function useCalleeService() {
  const calleeService = useContext(CalleeServiceContext);
  const [calleeState, setCalleeState] = useState(calleeService.state);
  useEffect(() => {
    if (calleeService) {
      calleeService.subscribe(setCalleeState);
    }
  }, [calleeService]);
  return [calleeState, calleeService];
}
