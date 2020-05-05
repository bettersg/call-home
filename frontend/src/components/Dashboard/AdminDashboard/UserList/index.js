import React, { useState } from 'react';
import './index.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import UserCalleeForm from './UserCalleeForm';
import { UserTypes } from '../../../../services/User';
import { useUserService } from '../../../../contexts';

function uppercaseToNormalCase(uppercased) {
  return uppercased[0] + uppercased.substr(1).toLocaleLowerCase();
}

function UserList() {
  const [userState, userService] = useUserService();
  const { users } = userState;

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const updateNewUserName = (event) => setNewUserName(event.target.value);
  const updateNewUserEmail = (event) => setNewUserEmail(event.target.value);

  return (
    <>
      <Typography variant="h6">All Users</Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          userService.createUser({
            name: newUserName,
            email: newUserEmail,
            userType: UserTypes.CALLER,
            callees: [],
          });
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
      {users.map((user) => (
        <Card key={user.email} className="user-card">
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">
              Name
              <IconButton
                aria-label="delete"
                onClick={() => userService.deleteUser(user.email)}
              >
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
            <UserCalleeForm user={user} />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default UserList;
