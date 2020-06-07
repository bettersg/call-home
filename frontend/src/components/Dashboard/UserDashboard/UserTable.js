import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import PhoneIcon from '@material-ui/icons/Phone';
import AddIcon from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { Avatar, Grid, Typography } from '@material-ui/core';
import CallDialog from '../CallerDashboard/CallDialog';

export default function UserTable() {
  const callees = [
    { id: 'aaa', name: 'AAA', phoneNumber: '+6597515885' },
    { id: 'aaa', name: 'AAA', phoneNumber: '+6597515885' },
    { id: 'aaa', name: 'AAA', phoneNumber: '+6597515885' },
  ];

  const [activeCall, setActiveCall] = useState(null);
  const onCallClick = (callee) => {
    setActiveCall({
      userEmail: 'singjie@singjie.com',
      phoneNumber: callee.phoneNumber,
      calleeName: callee.name,
    });
  };
  const rows = callees.map((callee) => (
    <Grid item container spacing={4} alignItems="center">
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
    <Grid item container spacing={4} alignItems="center">
      <Grid item>
        <AddIcon style={{ marginLeft: '18px' }} />
      </Grid>
      <Grid item>
        <Typography>Add Phone Numnber</Typography>
      </Grid>
    </Grid>
  );
  return (
    <Paper>
      <Grid container direction="column" spacing={4}>
        {rows.concat(addPhone)}
      </Grid>
      <CallDialog
        call={activeCall}
        open={Boolean(activeCall)}
        disconnectCall={() => setActiveCall(null)}
      />
    </Paper>
  );
}
