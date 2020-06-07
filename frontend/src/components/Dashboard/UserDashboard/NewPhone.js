import React from 'react';
import { TextField, Button } from '@material-ui/core';
import { useCalleeService, useUserService } from '../../../contexts';

export default function NewPhone({ onSubmit }) {
  const [calleeState, calleeService] = useCalleeService();
  const [userState, userService] = useUserService();

  const { me: user } = userState;

  return (
    <div>
      <form
        noValidate
        autoComplete="off"
        onSubmit={async (e) => {
          const name = e.target.name.value;
          const phonenumber = e.target.phonenumber.value;
          e.preventDefault();
          const callee = await calleeService.createCallee({
            name: name,
            phoneNumber: phonenumber,
          });
          if (!!callee) {
            await userService.updateUser(user.email, {
              name: user.name,
              email: user.email,
              userType: user.userType,
              callees: user.callees.concat([{ id: callee.id }]),
            });
            userService.refreshSelf();
          }
          onSubmit();
        }}
      >
        <div>
          <TextField id="name" label="Name" fullWidth />
        </div>
        <div>
          <TextField
            id="phonenumber"
            label="Phone Number"
            fullWidth
            placeholder="+880 03317 4137"
          />
        </div>
        <div>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            value="Submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
