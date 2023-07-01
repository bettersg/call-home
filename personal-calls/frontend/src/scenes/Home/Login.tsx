import React from 'react';
import { withStyles } from 'hack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Container, DetectBrowserSnackbar } from 'components';
import { SceneProps } from 'scenes/types';

import './Login.css';

// TODO figure out where to put these later
const EN_STRINGS = {
  DISPLAY_TITLE: 'Call Home',
  DISPLAY_SUBTITLE: 'Make free calls to loved ones back home in Bangladesh',
  DATA_CONSUMPTION_COPY: '100MB = 40 min talk',
  FACEBOOK_SIGN_UP: 'Sign up with Facebook',
  GOOGLE_SIGN_UP: 'Sign up with Google',
};
const STRINGS = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
    DISPLAY_TITLE: 'বাড়ীতে ফোন',
    // TODO this also includes India in the list of countries
    DISPLAY_SUBTITLE: 'ভারতে ফিরে বাংলাদেশে প্রিয়জনকে বিনামূল্যে কল করুন',
    /* DATA_CONSUMPTION_COPY: '100MB = 40 min talk', */
    FACEBOOK_SIGN_UP: 'ফেসবুক দিয়ে সাইন আপ',
  },
};

const DataConsumptionCopy = withStyles({
  borderRadius: '10000px',
  background: 'white',
  border: 1,
  borderColor: 'primary.800',
  color: 'primary.800',
  padding: '0 12px',
})(Box);

const FacebookButton = withStyles({
  marginTop: '60px',
  backgroundColor: '#1877F2',
  width: '100%',
  color: 'white',
  padding: '19px',
  '&:hover': {
    backgroundColor: '#1877F2',
  },
})(Button);

const GoogleButton = withStyles({
  marginTop: '60px',
  backgroundColor: '#FFFFFF',
  width: '100%',
  color: 'grey',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#FFFFFF',
  },
})(Button);

export default function Login({ locale }: SceneProps) {
  return (
    <Container
      style={{
        background: 'no-repeat url(/images/landing_bg.svg) bottom center',
        backgroundSize: 'contain',
        overflow: 'auto',
      }}
    >
      <DetectBrowserSnackbar />
      <div className="login-content">
        <img alt="" src="/images/landing_splash.svg" />
        <Typography style={{ marginTop: '24px' }} variant="h2" component="h1">
          {STRINGS[locale].DISPLAY_TITLE}
        </Typography>
        <Typography
          style={{ marginTop: '12px', textAlign: 'center' }}
          variant="body1"
        >
          {STRINGS[locale].DISPLAY_SUBTITLE}
        </Typography>
        <DataConsumptionCopy>
          <Typography variant="body2">
            {STRINGS[locale].DATA_CONSUMPTION_COPY}
          </Typography>
        </DataConsumptionCopy>
        <GoogleButton
          className="sign-up-button"
          variant="contained"
          disableElevation
          onClick={() => {
            (window as any).location = '/oauth/login/google';
          }}
          style={{ marginTop: '36px' }}
        >
          <img
            style={{ height: '3rem' }}
            alt=""
            src="/images/google_login.svg"
          />
          {STRINGS[locale].GOOGLE_SIGN_UP}
        </GoogleButton>
        <FacebookButton
          className="sign-up-button"
          variant="contained"
          disableElevation
          onClick={() => {
            (window as any).location = '/oauth/login/facebook';
          }}
          style={{ marginTop: '36px' }}
        >
          {STRINGS[locale].FACEBOOK_SIGN_UP}
        </FacebookButton>
      </div>
    </Container>
  );
}
