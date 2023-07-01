import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import './ContactsDialog.css';

const AVATAR_INDICES = [
  {
    group: 'male',
    // exclusive
    min: 0,
    // inclusive
    max: 5,
  },
  {
    group: 'female',
    // exclusive
    min: 5,
    // inclusive
    max: 10,
  },
];
const MAX_OPTIONS = AVATAR_INDICES.reduce(
  (acc, { max: maxIndex }) => Math.max(acc, maxIndex),
  0
);

function choiceToAvatarIndex(avatarChoice) {
  const [group, variantIndexString] = avatarChoice.split('_');
  const variantIndex = Number(variantIndexString);
  const groupInfo = AVATAR_INDICES.find(
    (avatarGroupInfo) => avatarGroupInfo.group === group
  );
  return groupInfo.min + variantIndex;
}

function avatarIndexToChoice(avatarIndex) {
  const groupInfo = AVATAR_INDICES.find(
    (avatarGroupInfo) =>
      avatarIndex >= avatarGroupInfo.min && avatarIndex <= avatarGroupInfo.max
  );

  return `${groupInfo.group}_${avatarIndex - groupInfo.min}`;
}

function roundAvatarIndex(avatarIndex) {
  return (avatarIndex + MAX_OPTIONS) % MAX_OPTIONS || MAX_OPTIONS;
}

function AvatarPicker({ avatarChoice, setAvatarChoice }) {
  const avatarUrl = `/images/avatars/${avatarChoice}.svg`;
  const avatarIndex = choiceToAvatarIndex(avatarChoice);
  const chooseNextVariant = () => {
    setAvatarChoice(avatarIndexToChoice(roundAvatarIndex(avatarIndex + 1)));
  };
  const choosePrevVariant = () => {
    setAvatarChoice(avatarIndexToChoice(roundAvatarIndex(avatarIndex - 1)));
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
      }}
    >
      <IconButton
        type="button"
        value=""
        onClick={choosePrevVariant}
        size="large"
      >
        <ArrowBackIosIcon style={{ height: '0.5em', width: '0.5em' }} />
      </IconButton>
      <ButtonBase>
        <img style={{ height: '4em', width: '4em' }} alt="" src={avatarUrl} />
      </ButtonBase>
      <IconButton
        type="button"
        value=""
        onClick={chooseNextVariant}
        size="large"
      >
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
        variant="h2"
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
            <AvatarPicker
              avatarChoice={avatarChoice}
              setAvatarChoice={setAvatarChoice}
            />
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
