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

function VerificationCodeForm({ phoneNumber }) {
  const [, userService] = useUserService();
  const [code, setCode] = useState('');

  useEffect(() => {
    beginPasswordless(phoneNumber);
  }, [phoneNumber]);

  return (
    <div>
      <div>Enter the verification code sent to {phoneNumber}.</div>
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
          await login(phoneNumber, code);
          await userService.refreshSelf();
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

  return (
    <Container>
      {hasSubmittedPhoneNumber ? (
        <VerificationCodeForm phoneNumber={phoneNumber} />
      ) : (
        <PhoneNumberForm
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          submitPhoneNumber={() => setHasSubmittedPhoneNumber(true)}
        />
      )}
    </Container>
  );
}
