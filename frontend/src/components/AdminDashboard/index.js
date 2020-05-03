import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { UserTypes } from '../../services/User';
import UserList from './UserList';
import CalleeList from './CalleeList';
import { useUserService } from '../../contexts';

function AdminDashboard() {
  const [userState] = useUserService();
  const { me: userInfo } = userState;

  if (!userInfo || !userInfo.role === UserTypes.ADMIN) {
    return null;
  }

  return (
    <>
      <Grid item xs={12} lg={6}>
        <Paper className="fixed-height-paper">
          <UserList />
        </Paper>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Paper className="fixed-height-paper">
          <CalleeList />
        </Paper>
      </Grid>
    </>
  );
}

export default AdminDashboard;
