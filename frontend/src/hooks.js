import { useState, useCallback } from 'react';

/* eslint-disable import/prefer-default-export */

// Genius (?) hack to throw async errors in a way that React error boundaries can handle them
export function useAsyncError() {
  const [, setError] = useState();

  return useCallback(
    (e) => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
}
