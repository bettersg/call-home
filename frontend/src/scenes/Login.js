import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Container from '../components/shared/Container';
import RoundedButton from '../components/shared/RoundedButton';

import './Login.css';

const SecondaryButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary[900],
    color: 'white',
    padding: '10px',
  },
}))(RoundedButton);

export default function Login() {
  return (
    <Container>
      <div className="login-content">
        <div className="login-buttons">
          <RoundedButton color="secondary" variant="contained" disableElevation>
            Sign Up
          </RoundedButton>
          <SecondaryButton variant="contained" disableElevation>
            Log In
          </SecondaryButton>
        </div>
      </div>
    </Container>
  );
}
