import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '../components/shared/Container';
import RoundedButton from '../components/shared/RoundedButton';
import { beginPasswordless, login } from '../services/Auth';
import { useUserService } from '../contexts';
import SCENES from './enums';

const SecondaryButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary[900],
    color: 'white',
    padding: '10px',
  },
}))(RoundedButton);

function PhoneNumberForm({ submitPhoneNumber, phoneNumber, setPhoneNumber }) {
  return (
    <div>
      <TextField
        fullWidth
        label="Phone number"
        value={phoneNumber}
        variant="outlined"
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <RoundedButton onClick={() => submitPhoneNumber(phoneNumber)}>
        Next
      </RoundedButton>
    </div>
  );
}

function VerificationCodeForm({ phoneNumber, setHasWhitelistError }) {
  const [, userService] = useUserService();
  const [code, setCode] = useState('');
  const [hasBadOtpError, setHasBadOtpError] = useState(false);

  useEffect(() => {
    beginPasswordless(phoneNumber);
  }, [phoneNumber]);

  return (
    <div>
      <div>Enter the verification code sent to {phoneNumber}.</div>
      {hasBadOtpError ? <div>Wrong code</div> : null}
      <TextField
        fullWidth
        label="Verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <RoundedButton
        variant="contained"
        disableElevation
        onClick={() => {
          beginPasswordless(phoneNumber);
        }}
      >
        Resend code
      </RoundedButton>
      <SecondaryButton
        variant="contained"
        disableElevation
        onClick={async () => {
          try {
            await login(phoneNumber, code);
            await userService.refreshSelf();
          } catch (e) {
            if (!e.data || !e.data.message) {
              throw e;
            }
            const { message } = e.data;
            if (message === 'NOT_WHITELISTED') {
              setHasWhitelistError(true);
            } else if (message === 'BAD_OTP') {
              setHasBadOtpError(true);
            }
          }
        }}
      >
        Submit
      </SecondaryButton>
    </div>
  );
}

export default function VerifyPhoneNumber({ navigate }) {
  const [userState, userService] = useUserService();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasSubmittedPhoneNumber, setHasSubmittedPhoneNumber] = useState(false);
  const [hasWhitelistError, setHasWhitelistError] = useState(false);
  const { me: user } = userState;

  useEffect(() => {
    if (userService) {
      userService.refreshSelf();
    }
  }, [userService]);

  useEffect(() => {
    if (user.isVerified) {
      navigate(SCENES.CONTACTS);
    }
  }, [userState]);

  let content;
  if (hasWhitelistError) {
    content = (
      <div>
        Sorry, your phone number is not part of this programme. If you believe
        this is an error, reach out to an administrator.
      </div>
    );
  } else if (hasSubmittedPhoneNumber) {
    content = (
      <VerificationCodeForm
        phoneNumber={phoneNumber}
        setHasWhitelistError={setHasWhitelistError}
      />
    );
  } else {
    content = (
      <PhoneNumberForm
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        submitPhoneNumber={() => setHasSubmittedPhoneNumber(true)}
      />
    );
  }
  return <Container>{content}</Container>;
}
