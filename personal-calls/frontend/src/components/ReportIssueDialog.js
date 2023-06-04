import React, { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { withStyles } from 'hack';
import { reportUserIssue } from '../services/Sentry';
import { PrimaryButton } from '../common/components';

const EN_STRINGS = {
  REPORT_ISSUE_ISSUE_TYPE_LABEL: 'Issue Type',
  REPORT_ISSUE_SUBMIT_LABEL: 'Submit',
  REPORT_ISSUE_DESCRIPTION_LABEL: 'Description',
  REPORT_ISSUE_BUG_TRACKING_TITLE: 'Bug Tracking',
  ISSUE_TITLES: {
    FACEBOOK_SIGN_IN: 'Cannot sign in with Facebook',
    OTP_FAILURE: 'Cannot receive OTP / phone code',
    CALL_FAILURE: 'Cannot connect / call',
    OTHER_COUNTRY: 'Looking to call another country',
    OTHER: 'Others',
  },
};

const STRINGS = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
  },
};

// TODO move this to its own module
const withDialogButtonStyles = withStyles({
  padding: '1em 2em',
  flex: '1 0',
  margin: '0 0.5rem',
});

const DialogPrimaryButton = withDialogButtonStyles(PrimaryButton);

export default function ReportIssueDialog({ user, locale, open, onClose }) {
  const [issueKey, setIssueKey] = useState('OTHER');
  const [description, setDescription] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    await reportUserIssue(user, {
      issueKey,
      description,
    });
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>
        {STRINGS[locale].REPORT_ISSUE_BUG_TRACKING_TITLE}
      </DialogTitle>
      <form
        onSubmit={onSubmit}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <InputLabel id="issue-type-label">
          {STRINGS[locale].REPORT_ISSUE_ISSUE_TYPE_LABEL}
        </InputLabel>
        <Select
          labelId="issue-type-label"
          style={{ backgroundColor: 'white' }}
          onChange={(e) => setIssueKey(e.target.value)}
          variant="outlined"
          value={issueKey}
        >
          {Object.entries(STRINGS[locale].ISSUE_TITLES).map(([key, title]) => (
            <MenuItem value={key} key={key}>
              {title}
            </MenuItem>
          ))}
        </Select>
        <InputLabel id="issue-description-label" style={{ marginTop: '2em' }}>
          {STRINGS[locale].REPORT_ISSUE_DESCRIPTION_LABEL}
        </InputLabel>
        <TextField
          labelId="issue-description-label"
          style={{ backgroundColor: 'white' }}
          rows={8}
          multiline
          variant="outlined"
          fullWidth
          onChange={(e) => setDescription(e.target.value)}
        />
        <DialogPrimaryButton
          style={{ marginTop: '2em' }}
          type="submit"
          value="submit"
        >
          {STRINGS[locale].REPORT_ISSUE_SUBMIT_LABEL}
        </DialogPrimaryButton>
      </form>
    </Dialog>
  );
}
