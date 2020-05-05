import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import roundedButtonStyles from '../../../shared/RoundedButtonStyles';
import UserTable from './UserTable';
import UserDrawer from '../UserDrawer';
import './index.css';

function UserPanel() {
  const classes = roundedButtonStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // TODO using one drawer for everything may not be the best approach.
  const [drawerPage, setDrawerPage] = useState(0);
  const [userToEdit, setUserToEdit] = useState(null);
  const openAddUserDrawer = () => {
    setDrawerPage(0);
    setDrawerOpen(true);
  };
  const openEditUserDrawer = (user) => {
    setUserToEdit(user);
    setDrawerPage(2);
    setDrawerOpen(true);
  };

  return (
    <div className="user-panel">
      <div className="user-panel-buttons">
        <Button color="primary" className={classes.root}>
          <AddIcon /> Import from csv
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.root}
          onClick={openAddUserDrawer}
        >
          <AddIcon /> Add volunteer
        </Button>
      </div>
      <Paper className="user-list">
        <UserTable openEditUserDrawer={openEditUserDrawer} />
      </Paper>
      <UserDrawer
      user={userToEdit}
        open={drawerOpen}
        drawerPage={drawerPage}
        setDrawerPage={setDrawerPage}
        closeDrawer={() => setDrawerOpen(false)}
      />
    </div>
  );
}

export default UserPanel;
