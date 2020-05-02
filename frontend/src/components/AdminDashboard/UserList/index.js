import React, { useState, useEffect } from 'react';
import './index.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import UserCalleeForm from './UserCalleeForm';
import {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  UserTypes,
} from '../../../services/Users';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

function uppercaseToNormalCase(uppercased) {
  return uppercased[0] + uppercased.substr(1).toLocaleLowerCase();
}

function UserList({ callees }) {
  const [allUsers, setAllUsers] = useState([]);

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  useEffect(() => {
    (async () => {
      const newAllUsers = await getAllUsers();
      setAllUsers(newAllUsers);
    })();
  }, []);

  const updateUserAndUpdateUsers = async (user) => {
    await updateUser(user.email, user);
    const newAllUsers = await getAllUsers();
    setAllUsers(newAllUsers);
  };
  const deleteUserAndUpdateUsers = async (userEmail) => {
    await deleteUser(userEmail);
    const newAllUsers = await getAllUsers();
    setAllUsers(newAllUsers);
  };
  const updateNewUserName = (event) => setNewUserName(event.target.value);
  const updateNewUserEmail = (event) => setNewUserEmail(event.target.value);

  return (
    <>
      <Typography variant="h6">All Users</Typography>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createUser({
            name: newUserName,
            email: newUserEmail,
            userType: UserTypes.CALLER,
            callees: [],
          });
          const newAllUsers = await getAllUsers();
          setAllUsers(newAllUsers);
        }}
      >
        <TextField
          fullWidth
          margin="normal"
          label="New user's name"
          type="text"
          id="new-user-name"
          value={newUserName}
          onChange={(e) => updateNewUserName(e)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="New user's email"
          type="text"
          id="new-user-email"
          value={newUserEmail}
          onChange={(e) => updateNewUserEmail(e)}
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
      {allUsers.map((user) => (
        <Card key={user.email} className="user-card">
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">
              Name
              <IconButton aria-label="delete" onClick={() => deleteUserAndUpdateUsers(user.email)}>
                <ClearIcon />
              </IconButton>
            </Typography>
            <Typography variant="body1">{user.name}</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Email Address
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              User Type
            </Typography>
            <Typography variant="body1">
              {uppercaseToNormalCase(user.userType)}
            </Typography>
            <UserCalleeForm
              user={user}
              callees={callees}
              updateUser={updateUserAndUpdateUsers}
            />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default UserList;
