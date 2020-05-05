import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { UserTypes } from '../services/User';
import { useUserService } from '../contexts';

function UserInfo({ dashboardChoice }) {
  const [userState] = useUserService();
  const { me: userInfo } = userState;

  if (!userInfo) {
    return <div>You are not logged in.</div>;
  }

  const { displayName } = userInfo;
  const dashboardText =
    dashboardChoice === UserTypes.ADMIN ? 'Admin Dashboard' : 'Call Dashboard';

  return (
    <Grid item xs={12} lg={12}>
      <Typography variant="subtitle1">Welcome, {displayName}</Typography>
      <Typography variant="h4">{dashboardText}</Typography>
    </Grid>
  );
}

export default UserInfo;
