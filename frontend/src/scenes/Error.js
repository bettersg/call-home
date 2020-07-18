import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '../components/shared/Container';

// TODO figure out where to put these later
const EN_STRINGS = {
  APP_ERROR_MESSAGE:
    'We have encountered an unexpected error. Try refreshing the page. If there is still an error, let us know.',
};
const STRINGS = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
  },
};

// TODO locale isn't working because this doesn't come from the router. move locale to a hook;
export default function Error({ locale = 'en' }) {
  return (
    <Container
      style={{
        background: 'no-repeat url(/images/landing_bg.svg) bottom center',
        backgroundSize: 'contain',
      }}
    >
      <Typography style={{ marginTop: '24px' }} variant="h5" component="h1">
        {STRINGS[locale].APP_ERROR_MESSAGE}
      </Typography>
    </Container>
  );
}
