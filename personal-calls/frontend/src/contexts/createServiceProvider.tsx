import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ObservableService } from '../services';

// Ok the type looks insane so I need to explain what's going on here.
// S is the type of the state.
// T is a specific subclass of ObservableService<S>.
// If this is specified as <S, T extends ObservableService<S>>, we need to give explicit type params e.g. <FeatureState, Feature> because Typescript cannot infer the value of S from T. It needs the extra hints from the params.
// Defined in this way, we start with our subclass T. Then we use the infer keyword + a conditional to get S from T by matching the type parameter.
export default function createServiceProvider<
  T extends ObservableService<S>,
  S = T extends ObservableService<infer R> ? R : never
>(Service: new () => T) {
  const ServiceContext: React.Context<T | null> = createContext<T | null>(null);
  const ServiceStateContext: React.Context<S | null> = createContext<S | null>(
    null
  );

  const service = new Service();

  return {
    Provider: function Provider({ children }: { children: JSX.Element }) {
      // TODO This should use null for the empty state. This is only safe to change once all of the services move to typescript.
      const [serviceState, setServiceState] = useState<S>({} as S);

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
    hook: function useService(): [S | null, T | null] {
      const innerService = useContext(ServiceContext);
      const serviceState = useContext(ServiceStateContext);
      return [serviceState, innerService];
    },
  };
}
