import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import PhoneIcon from '@material-ui/icons/Phone';
import AddIcon from '@material-ui/icons/Add';
import { Avatar, Grid, Typography } from '@material-ui/core';
import CallDialog from '../CallerDashboard/CallDialog';
import NewPhone from './NewPhone';
import { useUserService } from '../../../contexts';

export default function UserTable() {
  const [userState] = useUserService();
  const { me: userInfo } = userState;
  const callees = userInfo?.callees ?? [];

  console.log(userInfo.callees);

  const [activeCall, setActiveCall] = useState(null);
  const [showNewPhone, setShowNewPhone] = useState(false);
  const onCallClick = (callee) => {
    setActiveCall({
      userEmail: 'singjie@singjie.com',
      phoneNumber: callee.phoneNumber,
      calleeName: callee.name,
    });
  };
  const rows = callees.map((callee) => (
    <Grid item container spacing={4} alignItems="center" key={callee.id}>
      <Grid item>
        <Avatar style={{ marginLeft: '10px' }}>{callee.name}</Avatar>
      </Grid>
      <Grid item xs>
        <Typography>{callee.name}</Typography>
        <Typography>{callee.phoneNumber}</Typography>
      </Grid>
      <Grid item>
        <Button
          style={{ marginRight: '10px' }}
          onClick={() => onCallClick(callee)}
        >
          <PhoneIcon />
          Call
        </Button>
      </Grid>
    </Grid>
  ));

  const addPhone = (
    <Button
      onClick={() => {
        setShowNewPhone(true);
      }}
    >
      <Grid item container spacing={4} alignItems="center">
        <Grid item>
          <AddIcon style={{ marginLeft: '18px' }} />
        </Grid>
        <Grid item>
          <Typography>Add Phone Numnber</Typography>
        </Grid>
      </Grid>
    </Button>
  );
  return (
    <Grid item spacing={1} xs={12}>
      <Paper>
        {showNewPhone ? (
          <NewPhone
            onSubmit={() => {
              setShowNewPhone(false);
            }}
          />
        ) : (
          <>
            <Grid container direction="column" spacing={4}>
              {rows.concat(addPhone)}
            </Grid>
            <CallDialog
              call={activeCall}
              open={Boolean(activeCall)}
              disconnectCall={() => setActiveCall(null)}
            />
          </>
        )}
      </Paper>
    </Grid>
  );
}
