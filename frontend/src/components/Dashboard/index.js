import React from 'react';
import AdminDashboard from './AdminDashboard';
import CallerDashboard from './CallerDashboard';
import { UserTypes } from '../../services/User';

function Dashboard({ dashboardChoice, userInfo }) {
  if (!userInfo) {
    return null;
  }
  if (
    userInfo.role === UserTypes.ADMIN &&
    dashboardChoice === UserTypes.ADMIN
  ) {
    return <AdminDashboard />;
  }
  return <CallerDashboard />;
}

export default Dashboard;
