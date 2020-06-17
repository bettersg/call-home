import React from 'react';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import './ContactsDialog.css';

export default function ContactsDialog({
  open,
  onClose,
  onSubmit,
  titleText,
  errorText,
  formFields,
  actionButtons,
}) {
  return (
    <Dialog
      className="contacts-dialog"
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
    >
      <DialogTitle
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {titleText}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit} className="contacts-dialog-content">
          <div className="contacts-dialog-form-fields">
            {errorText ? (
              <Typography
                color="error"
                variant="body2"
                style={{ marginBottom: '12px' }}
              >
                {errorText}
              </Typography>
            ) : null}
            {formFields}
          </div>
          <div className="contacts-dialog-actions">{actionButtons}</div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
