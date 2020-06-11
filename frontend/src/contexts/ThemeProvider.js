import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1A237E',
      '900': '#1A237E',
    },
  },
});

export default function ThemeProvider({ children }) {
  return <MuThemeProvider theme={theme}>{children}</MuThemeProvider>;
}
