import { createTheme, adaptV4Theme } from '@mui/material/styles';

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
  grey: { 200: '#DBE0E1' },
  error: {
    main: '#FF3131',
  },
  yellow: {
    main: '#F2CC0D',
  },
};

const callHomeTheme = createTheme(
  adaptV4Theme({
    typography: {
      h4: {
        fontSize: 20,
        fontWeight: 700,
        color: colors.text.primary,
        fontFamily: 'Hind',
        lineHeight: '28px',
      },
      h5: {
        fontSize: 18,
        fontWeight: 600,
        color: colors.text.primary,
        fontFamily: 'Hind',
        lineHeight: '24px',
      },
      h6: {
        fontSize: 16,
        fontWeight: 600,
        color: 'colors.primary.800',
        fontFamily: 'Hind',
        lineHeight: '20px',
        textDecoration: 'underline',
      },
      subtitle1: {
        fontSize: 14,
        fontWeight: 400,
        color: '#000000',
        fontFamily: 'Hind',
      },
    },
    palette: {
      background: {
        default: colors.primary[100],
      },
      primary: colors.primary,
      grey: colors.grey,
      error: colors.error,
      warning: colors.yellow,
      text: {
        primary: colors.text.primary,
      },
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
  })
);

export default callHomeTheme;
