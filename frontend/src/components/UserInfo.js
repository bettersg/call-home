import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { UserTypes } from '../services/Users';

function UserInfo({ userInfo, toggleDashboardChoice }) {
  if (!userInfo) {
    return <div>You are not logged in.</div>;
  }

  const { displayName, role } = userInfo;

  return (
    <Grid item xs={12} lg={12}>
      <Card>
        <CardContent>
          <Typography variant="h6">Welcome! {displayName}</Typography>
          {role === UserTypes.ADMIN ? (
            <Button
              onClick={toggleDashboardChoice}
              color="primary"
              variant="contained"
            >
              Toggle dashboard
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </Grid>
  );
}

export default UserInfo;
