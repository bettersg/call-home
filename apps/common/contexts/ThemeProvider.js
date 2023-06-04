import React from 'react';
import { ThemeProvider as MuThemeProvider } from '@mui/material/styles';
import theme from '../Theme';

export default function ThemeProvider({ children }) {
  return <MuThemeProvider theme={theme}>{children}</MuThemeProvider>;
}
