import React from 'react';
import MuContainer from '@material-ui/core/Container';

const CONTAINER_STYLES = {
  height: '100vh',
};

export default function Container({ children, style, ...rest }) {
  const containerStyles = style
    ? {
        CONTAINER_STYLES,
        ...style,
      }
    : CONTAINER_STYLES;
  return (
    <MuContainer style={containerStyles} {...rest} maxWidth="lg">
      {children}
    </MuContainer>
  );
}
