import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router-dom';
import Container from '../components/shared/Container';
import { useUserService } from '../contexts';
import { PrimaryButton } from '../components/shared/RoundedButton';
import PATHS from './paths';

// TODO figure out where to put these later
const STRINGS = {
  en: {
    VERIFY_PHONE_NUMBER_TITLE: "What's your mobile number?",
    VERIFY_PHONE_NUMBER_NEXT: 'Next',
    VERIFY_PHONE_NUMBER_PHONE_NUMBER_LABEL: 'Phone number',
  },
};

export default function PhoneNumberForm({ locale }) {
  const [userState, userService] = useUserService();
  const { me: user, verificationPhoneNumber } = userState;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (userService) {
      userService.refreshSelf();
    }
  }, [userService]);

  if (!user) {
    return <Redirect to={PATHS.LOGIN} />;
  }
  if (user.isVerified) {
    return <Redirect to={PATHS.CONTACTS} />;
  }
  if (verificationPhoneNumber) {
    return <Redirect to={PATHS.VERIFY_PHONE_NUMBER_CODE} />;
  }

  const validatePhoneNumber = () => {
    if (!phoneNumber) {
      return false;
    }
    return phoneNumber.match(/\d{8}/) || phoneNumber.match(/\+65\d{8}/);
  };
  const onSubmit = () => {
    setIsTouched(true);
    if (validatePhoneNumber()) {
      userService.setPhoneNumber(phoneNumber);
    }
  };

  return (
    <Container>
      <form onSubmit={onSubmit} style={{ height: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <div>
            <Typography
              variant="h5"
              component="h1"
              style={{ marginBottom: '12px' }}
            >
              {STRINGS[locale].VERIFY_PHONE_NUMBER_TITLE}
            </Typography>
            <TextField
              fullWidth
              autoFocus
              error={isTouched && !validatePhoneNumber()}
              label={STRINGS[locale].VERIFY_PHONE_NUMBER_PHONE_NUMBER_LABEL}
              value={phoneNumber}
              variant="outlined"
              onChange={(e) => {
                setIsTouched(true);
                setPhoneNumber(e.target.value);
              }}
            />
          </div>
          <PrimaryButton
            disableFocusRipple
            color="primary"
            type="submit"
            value="submit"
          >
            {STRINGS[locale].VERIFY_PHONE_NUMBER_NEXT}
          </PrimaryButton>
        </div>
      </form>
    </Container>
  );
}
