import React from 'react';

// This uses the mui5 sx prop.
// TODO Presumably there's something easier than this e.g. a styling solution
// that doesn't use the sx prop or an HOC that already does this exact thing,
// but I couldn't figure out where, and this has tortured me enough.
export function withStyles(
  styles: Record<string, string | number | Record<string, string | number>>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (Component: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
