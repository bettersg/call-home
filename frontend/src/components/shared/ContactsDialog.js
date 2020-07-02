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
      <IconButton type="button" value="" onClick={choosePrevVariant}>
        <ArrowBackIosIcon style={{ height: '0.5em', width: '0.5em' }} />
      </IconButton>
      <ButtonBase>
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
