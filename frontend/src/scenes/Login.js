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
  useEffect(() => {
    if (userService) {
      userService.refreshSelf();
    }
  }, [userService]);
  const { me: user } = userState;

  if (user) {
    navigate(SCENES.CONTACTS_PAGE);
    return null;
  }

  return (
    <Container>
      <div className="login-content">
        <div className="login-buttons">
          <RoundedButton
            color="secondary"
            variant="contained"
            disableElevation
            onClick={() => navigate(SCENES.SIGNUP)}
          >
            Sign Up
          </RoundedButton>
          <SecondaryButton
            variant="contained"
            disableElevation
            onClick={() => {
              window.location = '/oauth/login';
            }}
          >
            Log In
          </SecondaryButton>
        </div>
      </div>
    </Container>
  );
}
