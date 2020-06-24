import React, { createContext, useContext, useEffect, useState } from 'react';

export default function createServiceProvider(Service) {
  const ServiceContext = createContext(null);
  const ServiceStateContext = createContext(null);

  const service = new Service();

  return {
    Provider: function Provider({ children }) {
      const [serviceState, setServiceState] = useState({});

      useEffect(() => {
        if (service) {
          service.subscribe(setServiceState);
        }
      }, []);

      return (
        <ServiceContext.Provider value={service}>
          <ServiceStateContext.Provider value={serviceState}>
            {children}
          </ServiceStateContext.Provider>
        </ServiceContext.Provider>
      );
    },
    hook: function useService() {
      const innerContactService = useContext(ServiceContext);
      const contactState = useContext(ServiceStateContext);
      return [contactState, innerContactService];
    },
  };
}
