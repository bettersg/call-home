import React from 'react';

export function withStyles(
  styles: Record<string, string | number | Record<string, string | number>>
) {
  return (Component: any) => {
    return function styled(props: any) {
      const { sx, ...rest } = props;
      return (
        <Component
          sx={[styles, ...(Array.isArray(sx) ? sx : [sx])]}
          {...rest}
        />
      );
    };
  };
}
