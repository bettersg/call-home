import React from 'react';
import MuiContainer from '@mui/material/Container';

// TODO document why meddling with --viewport-height is needed
document.documentElement.style.setProperty(
  '--viewport-height',
  `${window.innerHeight}px`
);
window.addEventListener('resize', () => {
  document.documentElement.style.setProperty(
    '--viewport-height',
    `${window.innerHeight}px`
  );
});

const CONTAINER_STYLES: React.CSSProperties = {
  // Mad hacks
  height: '1px',
  minHeight: 'var(--viewport-height)',
  padding: '3rem 2rem 2rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
};

export default function Container({
  children,
  style,
  ...rest
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  // TODO Don't pass the style object like this because it's hard to combine
  // with custom styling. Use a @mui native styling solution instead.
  const containerStyles = style
    ? {
        ...CONTAINER_STYLES,
        ...style,
      }
    : CONTAINER_STYLES;
  return (
    <MuiContainer style={containerStyles} {...rest} maxWidth="sm">
      {children}
    </MuiContainer>
  );
}
