import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '../components/shared/Container';

// TODO figure out where to put these later
const EN_STRINGS = {
  APP_DEFAULT_ERROR_MESSAGE:
    'We have encountered an unexpected error. Try refreshing the page. If there is still an error, let us know.',
  APP_LOCAL_STORAGE_ERROR_MESSAGE:
    'Our app needs cookies to work. Please enable cookies for our app.',
};

const STRINGS = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
  },
};

// TODO locale isn't working because this doesn't come from the router. move locale to a hook;
export default function Error({ error, reportError, locale = 'en' }) {
  let errorMessage;
  if (
    error.message.includes('localStorage') &&
    error.message.includes('Access is denied')
  ) {
    errorMessage = STRINGS[locale].APP_LOCAL_STORAGE_ERROR_MESSAGE;
  } else {
    errorMessage = STRINGS[locale].APP_DEFAULT_ERROR_MESSAGE;
    reportError();
  }
  return (
    <Container
      style={{
        background: 'no-repeat url(/images/landing_bg.svg) bottom center',
        backgroundSize: 'contain',
      }}
    >
      <Typography style={{ marginTop: '24px' }} variant="h5" component="h1">
        {errorMessage}
      </Typography>
    </Container>
  );
}
