import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useUserService } from '../contexts';
import { reportUserIssue } from '../services/Sentry';

function FeedbackDialog({ isOpen, setIsOpen }) {
  const [userState] = useUserService();
  const { me: userInfo } = userState || {};

  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userComments, setUserComments] = useState();

  useEffect(() => {
    if (userInfo) {
      const { name, emails } = userInfo;
      setUserName(name);
      setUserEmail(emails[0].value);
    }
  }, [userState]);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>Thanks for your feedback!</DialogTitle>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await reportUserIssue({
            userName,
            userEmail,
            userComments,
          });
          setIsOpen(false);
        }}
      >
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            id="feedback-user-name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            id="feedback-user-email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            rowsMax={6}
            margin="normal"
            label="Your comments"
            id="feedback-user-comments"
            value={userComments}
            onChange={(e) => setUserComments(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            value="Submit"
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default FeedbackDialog;
