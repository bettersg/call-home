import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useCalleeService } from '../../../../contexts';
import Drawer from '../../../shared/Drawer';

function NewCalleeForm({
  setNewCalleeName,
  setNewCalleePhoneNumber,
  newCalleeName,
  newCalleePhoneNumber,
  closeDrawer,
}) {
  const [, calleeService] = useCalleeService();
  const onSubmit = async (e) => {
    e.preventDefault();
    await calleeService.createCallee({
      name: newCalleeName,
      phoneNumber: newCalleePhoneNumber,
    });
    closeDrawer();
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        id="new-callee-name"
        value={newCalleeName}
        onChange={(e) => setNewCalleeName(e.target.value)}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Phone Number"
        id="new-callee-phoneNumber"
        value={newCalleePhoneNumber}
        onChange={(e) => setNewCalleePhoneNumber(e.target.value)}
      />
      <Button color="primary" variant="contained" type="submit" value="Submit">
        Next
      </Button>
    </form>
  );
}

function EditCalleeForm({ callee, closeDrawer }) {
  const [, calleeService] = useCalleeService();
  const [newCalleeName, setNewCalleeName] = useState(callee.name);
  const [newCalleePhoneNumber, setNewCalleePhoneNumber] = useState(
    callee.phoneNumber
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    await calleeService.updateCallee(callee.id, {
      name: newCalleeName,
      phoneNumber: callee.phoneNumber,
    });
    closeDrawer();
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          id="edit-callee-name"
          value={newCalleeName}
          onChange={(e) => setNewCalleeName(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          id="edit-callee-phone-number"
          value={newCalleePhoneNumber}
          onChange={(e) => setNewCalleePhoneNumber(e.target.value)}
        />
        <Button
          color="primary"
          variant="contained"
          type="submit"
          value="Submit"
        >
          Submit
        </Button>
      </form>
    </>
  );
}

function CalleeDrawer({
  callee,
  closeDrawer,
  drawerPage,
  setDrawerPage,
  ...rest
}) {
  const [newCalleeName, setNewCalleeName] = useState('');
  const [newCalleePhoneNumber, setNewCalleePhoneNumber] = useState('');
  const closeDrawerAndReset = () => {
    setDrawerPage(0);
    closeDrawer();
  };

  const pages = [
    {
      header: 'Add Senior',
      form: (
        <NewCalleeForm
          key={0}
          newCalleeName={newCalleeName}
          newCalleePhoneNumber={newCalleePhoneNumber}
          setNewCalleeName={setNewCalleeName}
          setNewCalleePhoneNumber={setNewCalleePhoneNumber}
          closeDrawer={closeDrawerAndReset}
        />
      ),
    },
    {
      header: 'Edit Senior',
      form: (
        <EditCalleeForm
          key={1}
          callee={callee}
          closeDrawer={closeDrawerAndReset}
        />
      ),
    },
  ];

  return (
    <Drawer
      header={pages[drawerPage].header}
      onCloseClick={closeDrawerAndReset}
      {...rest}
    >
      {pages[drawerPage].form}
    </Drawer>
  );
}

export default CalleeDrawer;
