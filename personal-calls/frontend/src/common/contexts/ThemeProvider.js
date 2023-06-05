import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import theme from '../Theme';

export default function ThemeProvider({ children }) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
