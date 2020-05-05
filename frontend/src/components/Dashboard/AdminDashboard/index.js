import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { UserTypes } from '../../../services/User';
import UserPanel from './UserPanel';
import CalleeList from './CalleeList';
import { useUserService } from '../../../contexts';
import './index.css';

function AdminTabPanel({ activeIndex, index, children }) {
  return (
    <div className="admin-panel" hidden={activeIndex !== index}>
      {children}
    </div>
  );
}

function AdminDashboard() {
  const [userState] = useUserService();
  const { me: userInfo } = userState;
  const [activeIndex, setActiveIndex] = useState(0);

  if (!userInfo || !userInfo.role === UserTypes.ADMIN) {
    return null;
  }

  return (
    <Grid container>
      <Grid item lg={12}>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          value={activeIndex}
          onChange={(_event, newValue) => setActiveIndex(newValue)}
        >
          <Tab label="Volunteers" index={0} />
          <Tab label="Seniors" index={1} />
        </Tabs>
      </Grid>
      <Grid item lg={12}>
        <AdminTabPanel index={0} activeIndex={activeIndex}>
          <UserPanel />
        </AdminTabPanel>
        <AdminTabPanel index={1} activeIndex={activeIndex}>
          <CalleeList />
        </AdminTabPanel>
      </Grid>
    </Grid>
  );
}

export default AdminDashboard;
