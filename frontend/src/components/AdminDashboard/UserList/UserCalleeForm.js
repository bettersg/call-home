import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useUserService, useCalleeService } from '../../../contexts';

function doesUserHaveCallee(user, callee) {
  return (
    user.callees.findIndex((userCallee) => userCallee.id === callee.id) >= 0
  );
}

// TODO improve this filtering
function UserCalleeForm({ user }) {
  const [, userService] = useUserService();

  const [calleeState] = useCalleeService();
  const { callees } = calleeState;

  const toggleUserCallee = (callee) => async () => {
    const userHasCallee = doesUserHaveCallee(user, callee);
    if (userHasCallee) {
      return userService.updateUser({
        ...user,
        callees: user.callees.filter((c) => c.id !== callee.id),
      });
    }
    return userService.updateUser({
      ...user,
      callees: [...user.callees, callee],
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary">
          Authorised callees:
        </Typography>
        <List dense disablePadding>
          {callees.map((callee) => (
            <ListItem divider key={callee.id}>
              <Checkbox
                checked={doesUserHaveCallee(user, callee)}
                onChange={toggleUserCallee(callee)}
              />
              {callee.name}({callee.phoneNumber})
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default UserCalleeForm;
