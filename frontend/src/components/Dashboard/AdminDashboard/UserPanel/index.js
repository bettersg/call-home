import React, { useState } from 'react';
import AdminPanel from '../AdminPanel';
import UserTable from './UserTable';
import UserDrawer from './UserDrawer';
import { useUserService } from '../../../../contexts';

function UserPanel() {
  const [userState, userService] = useUserService();
  const { users } = userState;
  const [drawerOpen, setDrawerOpen] = useState(false);
  // TODO using one drawer for everything may not be the best approach.
  const [drawerPage, setDrawerPage] = useState(0);
  const [userToEdit, setUserToEdit] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState(new Set());

  const openAddUserDrawer = () => {
    setDrawerPage(0);
    setDrawerOpen(true);
  };
  const openEditUserDrawer = (user) => {
    setUserToEdit(user);
    setDrawerPage(2);
    setDrawerOpen(true);
  };

  const table = (
    <UserTable
      selectedIndices={selectedIndices}
      setSelectedIndices={setSelectedIndices}
      openEditUserDrawer={openEditUserDrawer}
    />
  );
  const drawer = (
    <UserDrawer
      user={userToEdit}
      open={drawerOpen}
      drawerPage={drawerPage}
      setDrawerPage={setDrawerPage}
      closeDrawer={() => setDrawerOpen(false)}
    />
  );
  const deleteCount = selectedIndices.size;
  const deleteSelected = () => {
    const selectedUserIds = Array.from(selectedIndices).map(
      (idx) => users[idx].id
    );
    setSelectedIndices(new Set());
    // TODO due to the implementation of deleteUser, the frontend will make an unnecessary 'refresh' request after every delete. Ideally the service should know how to batch these updates so that the refresh only happens once.
    selectedUserIds.forEach((userId) => userService.deleteUser(userId));
  };
  return (
    <AdminPanel
      table={table}
      drawer={drawer}
      addText="Add Volunteer"
      onAddClicked={openAddUserDrawer}
      deleteCount={deleteCount}
      deleteText="DELETE VOLUNTEERS"
      deleteSelected={deleteSelected}
    />
  );
}

export default UserPanel;
