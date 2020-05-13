import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import { useUserService, useCalleeService } from '../../../../contexts';
import { UserTypes } from '../../../../services/User';
import Drawer from '../../../shared/Drawer';
import CheckboxTable from '../../../shared/CheckboxTable';

function NewUserForm({
  setNewUserName,
  setNewUserEmail,
  newUserName,
  newUserEmail,
  goToNextForm,
}) {
  const onSubmit = async (e) => {
    e.preventDefault();
    goToNextForm();
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        id="new-user-name"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        id="new-user-email"
        value={newUserEmail}
        onChange={(e) => setNewUserEmail(e.target.value)}
      />
      <Button color="primary" variant="contained" type="submit" value="Submit">
        Next
      </Button>
    </form>
  );
}

function AssignCalleesTable({ callees, selectedIndices, setSelectedIndices }) {
  const [rowItems, setRowItems] = useState([]);
  useEffect(() => {
    setRowItems(
      callees.map((callee) => ({
        data: callee,
        key: callee.id,
      }))
    );
  }, [callees]);

  const rowItemToTableRow = (callee) => (
    <TableCell>
      <Typography>{callee.name}</Typography>
      <Typography variant="subtitle2">{callee.phoneNumber}</Typography>
    </TableCell>
  );
  return (
    <CheckboxTable
      headerLabels={["SENIOR'S NAME"]}
      rowItems={rowItems}
      rowItemToTableRow={rowItemToTableRow}
      selectedIndices={selectedIndices}
      setSelectedIndices={setSelectedIndices}
    />
  );
}

function AssignCalleesForm({ newUserName, newUserEmail, closeDrawer }) {
  const [, userService] = useUserService();
  const [calleeState] = useCalleeService();
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const { callees } = calleeState;

  const onSubmit = async (e) => {
    e.preventDefault();
    await userService.createUser({
      name: newUserName,
      email: newUserEmail,
      userType: UserTypes.CALLER,
      callees: Array.from(selectedIndices).map((idx) => callees[idx]),
    });
    closeDrawer();
  };
  return (
    <>
      <Typography variant="subtitle1">To: {newUserName}</Typography>
      <AssignCalleesTable
        callees={callees}
        selectedIndices={selectedIndices}
        setSelectedIndices={setSelectedIndices}
      />
      <form onSubmit={onSubmit}>
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

function EditCallerForm({ user, closeDrawer }) {
  const [, userService] = useUserService();
  const [calleeState] = useCalleeService();
  const { callees } = calleeState;
  const [newUserName, setNewUserName] = useState(user.name);
  const [selectedIndices, setSelectedIndices] = useState(new Set());

  // TODO this is not a very efficient way to find which callees are assigned to the user
  useEffect(() => {
    const selectedCalleeIndices = new Set();
    const selectedCalleeIds = new Set(user.callees.map((c) => c.id));
    callees.forEach((callee, idx) => {
      if (selectedCalleeIds.has(callee.id)) {
        selectedCalleeIndices.add(idx);
      }
    });
    setSelectedIndices(selectedCalleeIndices);
  }, [user]);

  // TODO email is not editable because it's used as an identifier. This requires a backend change.

  const onSubmit = async (e) => {
    e.preventDefault();
    await userService.updateUser(user.id, {
      name: newUserName,
      email: user.email,
      userType: user.userType,
      callees: Array.from(selectedIndices).map((idx) => callees[idx]),
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
          id="edit-user-name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <AssignCalleesTable
          callees={callees}
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
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

function UserDrawer({ user, closeDrawer, drawerPage, setDrawerPage, ...rest }) {
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const closeDrawerAndReset = () => {
    setDrawerPage(0);
    closeDrawer();
  };

  const pages = [
    {
      header: 'Add Volunteers',
      form: (
        <NewUserForm
          key={0}
          newUserName={newUserName}
          newUserEmail={newUserEmail}
          setNewUserName={setNewUserName}
          setNewUserEmail={setNewUserEmail}
          closeDrawer={closeDrawerAndReset}
          goToNextForm={() => setDrawerPage(1)}
        />
      ),
    },
    {
      header: 'Assign Seniors',
      form: (
        <AssignCalleesForm
          key={1}
          newUserName={newUserName}
          newUserEmail={newUserEmail}
          closeDrawer={closeDrawerAndReset}
        />
      ),
    },
    {
      header: 'Edit Volunteer',
      form: (
        <EditCallerForm key={2} user={user} closeDrawer={closeDrawerAndReset} />
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

export default UserDrawer;
