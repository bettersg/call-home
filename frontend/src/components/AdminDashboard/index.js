import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { UserTypes } from '../../services/Users';
import UserList from './UserList';
import CalleeList from './CalleeList';
import './index.css';
import { createCallee, deleteCallee, getAllCallees } from '../../services/Callees';

function AdminDashboard({ userInfo }) {
  const [callees, setCallees] = useState([]);
  useEffect(() => {
    (async () => {
      const newCallees = await getAllCallees();
      setCallees(newCallees);
    })();
  }, []);

  if (!userInfo || !userInfo.role === UserTypes.ADMIN) {
    return null;
  }

  const createCalleeAndUpdate = async (callee) => {
    await createCallee(callee);
    const newCallees = await getAllCallees();
    setCallees(newCallees);
  };

  const deleteCalleeAndUpdate = async (callee) => {
    await deleteCallee(callee);
    const newCallees = await getAllCallees();
    setCallees(newCallees);
  };

  return (
    <>
      <Grid item xs={12} lg={6}>
        <Paper className="fixed-height-paper">
          <UserList callees={callees} />
        </Paper>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Paper className="fixed-height-paper">
          <CalleeList callees={callees} deleteCallee={deleteCalleeAndUpdate} createCallee={createCalleeAndUpdate} />
        </Paper>
      </Grid>
    </>
  );
}

export default AdminDashboard;
