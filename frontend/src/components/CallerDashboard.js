import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Phone from './Phone';

function CallerDashboard({ userInfo }) {
  const [activeCall, setActiveCall] = useState(null);
  const [calleeName, setCalleeName] = useState('');

  return (
    <>
      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">My Callees</Typography>
            <List dense disablePadding>
              {userInfo.callees.map((callee) => (
                <ListItem key={callee.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="textSecondary">
                        Name
                      </Typography>
                      <Typography>{callee.name}</Typography>
                      {activeCall ? null : (
                        <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            setActiveCall({
                              userEmail: userInfo.email,
                              calleeId: callee.id,
                            });
                            setCalleeName(callee.name);
                          }}
                      >
                          Call!
                      </Button>
                      )}
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
            <Phone call={activeCall} calleeName={calleeName} disconnectCall={() => setActiveCall(null) }/>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

export default CallerDashboard;
