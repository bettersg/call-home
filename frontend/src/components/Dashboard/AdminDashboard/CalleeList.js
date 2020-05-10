import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { useCalleeService } from '../../../contexts';

function CalleeList() {
  const [calleeState, calleeService] = useCalleeService();
  const { callees } = calleeState;

  const [newCalleeName, setNewCalleeName] = useState('');
  const [newCalleePhoneNumber, setNewCalleePhoneNumber] = useState('');

  const updateNewCalleeName = (event) => setNewCalleeName(event.target.value);
  const updateNewCalleePhoneNumber = (event) =>
    setNewCalleePhoneNumber(event.target.value);

  return (
    <>
      <Typography variant="h6">All Callees</Typography>
      <Card className="callee-card">
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              calleeService.createCallee({
                name: newCalleeName,
                phoneNumber: newCalleePhoneNumber,
              });
            }}
          >
            <TextField
              fullWidth
              margin="normal"
              label="New callee's name"
              id="new-callee-name"
              value={newCalleeName}
              onChange={(e) => updateNewCalleeName(e)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="New callee's phone number"
              id="new-callee-phone-number"
              value={newCalleePhoneNumber}
              onChange={(e) => updateNewCalleePhoneNumber(e)}
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
        </CardContent>
      </Card>
      {callees.map((callee) => (
        <Card key={callee.phoneNumber} className="callee-card">
          <CardContent>
            <div>
              <Typography variant="subtitle2" color="textSecondary">
                Name
                <IconButton
                  aria-label="delete"
                  onClick={() => calleeService.deleteCallee(callee.id)}
                >
                  <ClearIcon />
                </IconButton>
              </Typography>
            </div>
            <Typography variant="body1">{callee.name}</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Phone Number
            </Typography>
            <Typography variant="body1">{callee.phoneNumber}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default CalleeList;
