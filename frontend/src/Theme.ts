import { createMuiTheme } from '@material-ui/core/styles';

const colors = {
  primary: {
    100: '#F7FBFD',
    200: '#F3FAFC',
    300: '#CBE8F1',
    400: '#A3D6E6',
    500: '#7BC4DA',
    600: '#52B2CF',
    700: '#349CBC',
    800: '#297B94',
    900: '#1E5A6C',
  },
  text: {
    primary: '#133844',
  },
  grey: {
    light: '#DBE0E1',
  },
  error: {
    main: '#FF3131',
  },
};

const callHomeTheme = createMuiTheme({
  palette: {
    background: {
      default: colors.primary[100],
    },
    primary: colors.primary,
    grey: colors.grey as any,
    error: colors.error,
  },
  overrides: {
    MuiTypography: {
      root: {
        color: colors.text.primary,
        fontFamily:
          '"Hind Siliguri", "Roboto", "Helvetica", "Arial", sans-serif !important',
      },
    },
  },
});

export default callHomeTheme;
