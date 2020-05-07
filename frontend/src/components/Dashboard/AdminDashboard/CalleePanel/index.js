import React, { useState } from 'react';
import AdminPanel from '../AdminPanel';
import CalleeTable from './CalleeTable';
import CalleeDrawer from './CalleeDrawer';

function CalleePanel() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // TODO using one drawer for everything may not be the best approach.
  const [drawerPage, setDrawerPage] = useState(0);
  const [calleeToEdit, setCalleeToEdit] = useState(null);
  const openAddCalleeDrawer = () => {
    setDrawerPage(0);
    setDrawerOpen(true);
  };
  const openEditCalleeDrawer = (callee) => {
    setCalleeToEdit(callee);
    setDrawerPage(1);
    setDrawerOpen(true);
  };

  const table = <CalleeTable openEditCalleeDrawer={openEditCalleeDrawer} />;
  const drawer = (
    <CalleeDrawer
      callee={calleeToEdit}
      open={drawerOpen}
      drawerPage={drawerPage}
      setDrawerPage={setDrawerPage}
      closeDrawer={() => setDrawerOpen(false)}
    />
  );
  return (
    <AdminPanel
      table={table}
      drawer={drawer}
      addText="Add Senior"
      onAddClicked={openAddCalleeDrawer}
    />
  );
}

export default CalleePanel;
