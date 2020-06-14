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
};

const callHomeTheme = createMuiTheme({
  palette: {
    background: {
      default: colors.primary[100],
    },
    primary: colors.primary,
  },
  typography: {
    h1: {
      color: colors.text.primary,
    },
    h2: {
      color: colors.text.primary,
    },
    h3: {
      color: colors.text.primary,
    },
    h4: {
      color: colors.text.primary,
    },
    h5: {
      color: colors.text.primary,
    },
    h6: {
      color: colors.text.primary,
    },
    body1: {
      color: colors.text.primary,
    },
  },
});

export default callHomeTheme;
