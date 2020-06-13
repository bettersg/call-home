import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Container from '../components/shared/Container';
import RoundedButton from '../components/shared/RoundedButton';
import { useUserService } from '../contexts';
import SCENES from './enums';

import './Login.css';

const SecondaryButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary[900],
    color: 'white',
    padding: '10px',
  },
}))(RoundedButton);

export default function Login({ navigate }) {
  const [userState, userService] = useUserService();
  const { me: user } = userState;
  useEffect(() => {
    if (userService) {
      userService.refreshSelf();
    }
  }, [userService]);

  useEffect(() => {
    if (user) {
      navigate(SCENES.VERIFY_PHONE_NUMBER);
    }
  }, [userState]);

  return (
    <Container>
      <div className="login-content">
        <div className="login-buttons">
          <SecondaryButton
            variant="contained"
            disableElevation
            onClick={() => {
              window.location = '/oauth/login';
            }}
          >
            Log in with Facebook
          </SecondaryButton>
        </div>
      </div>
    </Container>
  );
}
