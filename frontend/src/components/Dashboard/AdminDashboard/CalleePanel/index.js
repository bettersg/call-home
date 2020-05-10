import React, { useState } from 'react';
import AdminPanel from '../AdminPanel';
import CalleeTable from './CalleeTable';
import CalleeDrawer from './CalleeDrawer';
import { useCalleeService } from '../../../../contexts';

function CalleePanel() {
  const [calleeState, calleeService] = useCalleeService();
  const { callees } = calleeState;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
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

  const table = (
    <CalleeTable
      selectedIndices={selectedIndices}
      setSelectedIndices={setSelectedIndices}
      openEditCalleeDrawer={openEditCalleeDrawer}
    />
  );
  const drawer = (
    <CalleeDrawer
      callee={calleeToEdit}
      open={drawerOpen}
      drawerPage={drawerPage}
      setDrawerPage={setDrawerPage}
      closeDrawer={() => setDrawerOpen(false)}
    />
  );
  const deleteCount = selectedIndices.size;
  const deleteSelected = () => {
    const selectedCalleeIds = Array.from(selectedIndices).map(
      (idx) => callees[idx].id
    );
    setSelectedIndices(new Set());
    // TODO due to the implementation of deleteCallee, the frontend will make an unnecessary 'refresh' request after every delete. Ideally the service should know how to batch these updates so that the refresh only happens once.
    selectedCalleeIds.forEach((calleeId) =>
      calleeService.deleteCallee(calleeId)
    );
  };
  return (
    <AdminPanel
      table={table}
      drawer={drawer}
      addText="Add Senior"
      onAddClicked={openAddCalleeDrawer}
      deleteCount={deleteCount}
      deleteText="DELETE SENIORS"
      deleteSelected={deleteSelected}
    />
  );
}

export default CalleePanel;
