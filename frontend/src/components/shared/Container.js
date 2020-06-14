import React from 'react';
import MuContainer from '@material-ui/core/Container';

const CONTAINER_STYLES = {
  height: 'calc(100%)',
  padding: '5% 5%',
  display: 'flex',
  flexDirection: 'column',
};

export default function Container({ children, style, ...rest }) {
  const containerStyles = style
    ? {
        CONTAINER_STYLES,
        ...style,
      }
    : CONTAINER_STYLES;
  return (
    <MuContainer style={containerStyles} {...rest} maxWidth="sm">
      {children}
    </MuContainer>
  );
}
