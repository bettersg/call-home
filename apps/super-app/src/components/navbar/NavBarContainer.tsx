import React from 'react';
import { Box } from '@mui/material';
import { NavBar } from '.';
import { Container } from '../../common/components';
import './navbar/NavBarAbove.css';

interface NavBarContainerProps {
  children: React.ReactNode;
  containerStyle?: React.CSSProperties;
  aboveStyle?: React.CSSProperties;
}

export function NavBarContainer<T extends NavBarContainerProps>(props: T) {
  const { children, aboveStyle, containerStyle, ...rest } = props;

  return (
    <Container {...rest} style={containerStyle}>
      <Box className="navbar-above" style={aboveStyle}>
        {children}
      </Box>
      <NavBar />
    </Container>
  );
}
