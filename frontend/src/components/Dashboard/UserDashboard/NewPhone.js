import React from 'react';
import { TextField, Button, Grid } from '@material-ui/core';
import { useCalleeService, useUserService } from '../../../contexts';

export default function NewPhone({ onSubmit }) {
  const [, calleeService] = useCalleeService();
  const [userState, userService] = useUserService();

  const { me: user } = userState;

  return (
    <Grid container direction="column" style={{ padding: 10 }}>
      <Grid item>Add New Phone Number</Grid>
      <form
        noValidate
        autoComplete="off"
        onSubmit={async (e) => {
          const name = e.target.name.value;
          const phonenumber = e.target.phonenumber.value;
          e.preventDefault();
          const callee = await calleeService.createCallee({
            name,
            phoneNumber: phonenumber,
          });
          if (callee) {
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
        <Grid item>
          <TextField id="name" label="Name" fullWidth />
        </Grid>
        <Grid item>
          <TextField
            id="phonenumber"
            label="Phone Number"
            fullWidth
            placeholder="+880 03317 4137"
          />
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            value="Submit"
            style={{ marginTop: 20 }}
          >
            Submit
          </Button>
        </Grid>
      </form>
    </Grid>
  );
}
