import React from 'react';
import { ThemeProvider as MuThemeProvider } from '@material-ui/styles';
import theme from '../Theme';

export default function ThemeProvider({ children }) {
  return <MuThemeProvider theme={theme}>{children}</MuThemeProvider>;
}
