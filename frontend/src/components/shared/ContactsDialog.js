import React from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';

import './ContactsDialog.css';

const AVATAR_OPTIONS = {
  male: {
    numOptions: 5,
  },
  female: {
    numOptions: 5,
  },
};

function parseAvatarChoice(avatarChoice) {
  const [group, variantString] = avatarChoice.split('_');
  return {
    group,
    variant: Number(variantString),
  };
}

function toAvatarChoice({ group, variant }) {
  return `${group}_${variant}`;
}

function AvatarPicker({ avatarChoice: avatarChoiceString, setAvatarChoice }) {
  const avatarChoice = parseAvatarChoice(avatarChoiceString);
  const { variant, group } = avatarChoice;
  const numAvatarOptions = AVATAR_OPTIONS[group].numOptions;
  const avatarUrl = `/images/avatars/${group}_${variant}.svg`;
  const chooseNextVariant = () =>
    setAvatarChoice(
      toAvatarChoice({
        ...avatarChoice,
        variant: (variant + 1) % numAvatarOptions || numAvatarOptions,
      })
    );
  const choosePrevVariant = () =>
    setAvatarChoice(
      toAvatarChoice({
        ...avatarChoice,
        variant:
          (variant - 1 + numAvatarOptions) % numAvatarOptions ||
          numAvatarOptions,
      })
    );

  const cycleGroup = () =>
    setAvatarChoice(
      toAvatarChoice({
        ...avatarChoice,
        group: group === 'male' ? 'female' : 'male',
      })
    );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
      }}
    >
      <IconButton type="button" value="" onClick={choosePrevVariant}>
        <ArrowBackIosIcon style={{ height: '0.5em', width: '0.5em' }} />
      </IconButton>
      <ButtonBase onClick={cycleGroup} onKeyDown={cycleGroup}>
        <img style={{ height: '4em', width: '4em' }} alt="" src={avatarUrl} />
      </ButtonBase>
      <IconButton type="button" value="" onClick={chooseNextVariant}>
        <ArrowForwardIosIcon style={{ height: '0.5em', width: '0.5em' }} />
      </IconButton>
    </div>
  );
}

export default function ContactsDialog({
  open,
  onClose,
  onSubmit,
  avatarChoice,
  setAvatarChoice,
  isInProgress,
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
          padding: '8px 24px',
        }}
      >
        {titleText}
      </DialogTitle>
      <DialogContent
        style={{
          padding: '8px 8px',
        }}
      >
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
            {
              <AvatarPicker
                avatarChoice={avatarChoice}
                setAvatarChoice={setAvatarChoice}
              />
            }
            {formFields}
          </div>
          <div className="contacts-dialog-actions">
            {isInProgress ? <CircularProgress /> : actionButtons}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
