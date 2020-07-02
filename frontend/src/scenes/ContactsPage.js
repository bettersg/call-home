import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CallIcon from '@material-ui/icons/Call';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Container from '../components/shared/Container';
import {
  NeutralButton,
  ErrorButton,
  PrimaryButton,
} from '../components/shared/RoundedButton';
import ContactsDialog from '../components/shared/ContactsDialog';
import { useUserService, useContactService } from '../contexts';
import { ApiValidationError } from '../services/apiClient';
import PhoneNumberMasks from '../components/shared/PhoneNumberMask';
import PATHS from './paths';

const COUNTRIES = {
  // Unicode flag + country
  // TODO make this localized
  SG: '🇸🇬Singapore',
  BD: '🇧🇩Bangladesh',
};

const STRINGS = {
  en: {
    CONTACTS_TITLE: 'Your loved ones',
    CONTACTS_SUBTITLE: 'Call your loved ones back home',
    CONTACTS_ADD_CONTACT_LABEL: 'Add a loved one',
    CONTACTS_ADD_LABEL: 'Add',
    CONTACTS_COUNTRY_LABEL: (code) => `Country: ${COUNTRIES[code]}`,
    CONTACTS_NAME_LABEL: 'Name',
    CONTACTS_PHONE_NUMBER_LABEL: 'Phone number',
    CONTACTS_EDIT_CONTACT_HEADER: 'Edit',
    CONTACTS_EDIT_LABEL: 'Edit',
    CONTACTS_SAVE_LABEL: 'Save',
    CONTACTS_CANCEL_LABEL: 'Cancel',
    CONTACTS_DELETE_LABEL: 'Delete',
    CONTACTS_DELETE_CONTACT_LABEL: 'Delete contact',
    CONTACTS_CANNOT_UNDO_MESSAGE: 'This action cannot be undone',
    CONTACTS_UNKNOWN_ERROR_MESSAGE: 'Unknown error',
    errors: {
      DUPLICATE_CONTACT: 'You already have a loved one with this number',
      INVALID_PHONE_NUMBER: 'You have entered an invalid phone number',
    },
  },
};

const AddContactButton = withStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.grey.light}`,
    color: theme.palette.primary[700],
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: 'white',
    },
  },
}))(Button);

const AddContactIcon = withStyles((theme) => ({
  root: {
    color: 'white',
    backgroundColor: theme.palette.primary[300],
    borderRadius: '1000px',
  },
}))(AddIcon);

const ContactBox = withStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.grey.light}`,
  },
}))(Box);

const ContactCallIcon = withStyles((theme) => ({
  root: {
    transform: 'rotate(270deg)',
    color: theme.palette.primary[900],
  },
}))(CallIcon);

const LogoutLink = withStyles((theme) => ({
  root: {
    cursor: 'pointer',
    position: 'absolute',
    bottom: '3em',
    right: '3em',
    display: 'flex',
    color: theme.palette.primary[900],
  },
}))(Typography);

const withDialogButtonStyles = withStyles(() => ({
  root: {
    padding: '1em 2em',
    flex: '1 0',
    margin: '0 0.5rem',
  },
}));

const DialogNeutralButton = withDialogButtonStyles(NeutralButton);
const DialogPrimaryButton = withDialogButtonStyles(PrimaryButton);
const DialogErrorButton = withDialogButtonStyles(ErrorButton);

function AddContactDialog({ open, onClose, locale }) {
  const [userState] = useUserService();
  const { me: user } = userState;
  const [, contactService] = useContactService();
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhoneNumber, setNewContactPhoneNumber] = useState('');
  const [newContactAvatarChoice, setNewContactAvatarChoice] = useState(
    'female_1'
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRequestInFlight, setIsRequestInFlight] = useState(false);

  useEffect(() => {
    setNewContactName('');
    setNewContactPhoneNumber('');
  }, [open]);

  const createContact = async (event) => {
    event.preventDefault();
    try {
      setErrorMessage(null);
      setIsRequestInFlight(true);
      await contactService.createContact(user.id, {
        name: newContactName,
        phoneNumber: newContactPhoneNumber,
        avatar: newContactAvatarChoice,
      });
      onClose();
    } catch (error) {
      if (error instanceof ApiValidationError) {
        const { code } = error;
        setErrorMessage(
          STRINGS[locale].errors[code] ||
            STRINGS[locale].CONTACTS_UNKNOWN_ERROR_MESSAGE
        );
      }
    } finally {
      setIsRequestInFlight(false);
    }
  };

  const formFields = (
    <>
      <TextField
        style={{
          marginBottom: '12px',
        }}
        fullWidth
        variant="outlined"
        label={STRINGS[locale].CONTACTS_NAME_LABEL}
        value={newContactName}
        onChange={(event) => setNewContactName(event.target.value)}
        className="contacts-dialog-input"
      />
      <TextField
        style={{
          marginBottom: '12px',
        }}
        fullWidth
        variant="outlined"
        label="Phone number"
        value={newContactPhoneNumber}
        onChange={(event) => setNewContactPhoneNumber(event.target.value)}
        InputProps={{
          inputComponent: PhoneNumberMasks[user.destinationCountry],
        }}
        className="contacts-dialog-input"
      />
    </>
  );
  const actionButtons = (
    <DialogPrimaryButton type="submit" value="submit">
      {STRINGS[locale].CONTACTS_ADD_LABEL}
    </DialogPrimaryButton>
  );
  return (
    <ContactsDialog
      open={open}
      onClose={onClose}
      onSubmit={createContact}
      titleText={STRINGS[locale].CONTACTS_ADD_CONTACT_LABEL}
      formFields={formFields}
      isInProgress={isRequestInFlight}
      actionButtons={actionButtons}
      errorText={errorMessage}
      avatarChoice={newContactAvatarChoice}
      setAvatarChoice={setNewContactAvatarChoice}
    />
  );
}

function EditContactDialog({ contact, open, onClose, locale }) {
  const [userState] = useUserService();
  const { me: user } = userState;
  const [, contactService] = useContactService();
  const [newContactName, setNewContactName] = useState(contact.name);
  const [isDeletingContact, setIsDeletingContact] = useState(false);
  const [newContactPhoneNumber, setNewContactPhoneNumber] = useState(
    contact.phoneNumber
  );
  const [newContactAvatarChoice, setNewContactAvatarChoice] = useState(
    contact.avatar || 'female_1'
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRequestInFlight, setIsRequestInFlight] = useState(false);

  const updateContact = async (event) => {
    event.preventDefault();
    try {
      setErrorMessage(null);
      setIsRequestInFlight(true);
      await contactService.updateContact(user.id, contact.id, {
        name: newContactName,
        phoneNumber: newContactPhoneNumber,
        avatar: newContactAvatarChoice,
      });
      onClose();
    } catch (error) {
      if (error instanceof ApiValidationError) {
        const { code } = error;
        setErrorMessage(
          STRINGS[locale].errors[code] ||
            STRINGS[locale].CONTACTS_UNKNOWN_ERROR_MESSAGE
        );
      }
    } finally {
      setIsRequestInFlight(false);
    }
  };

  const deleteContact = async () => {
    await contactService.deleteContact(user.id, contact.id);
    onClose();
  };

  const formFields = (
    <>
      <TextField
        style={{
          marginBottom: '12px',
        }}
        fullWidth
        variant="outlined"
        label={STRINGS[locale].CONTACTS_NAME_LABEL}
        value={newContactName}
        onChange={(event) => setNewContactName(event.target.value)}
        className="contacts-dialog-input"
      />
      <TextField
        style={{
          marginBottom: '12px',
        }}
        fullWidth
        variant="outlined"
        label={STRINGS[locale].CONTACTS_PHONE_NUMBER_LABEL}
        value={newContactPhoneNumber}
        onChange={(event) => setNewContactPhoneNumber(event.target.value)}
        InputProps={{
          inputComponent: PhoneNumberMasks[user.destinationCountry],
        }}
        className="contacts-dialog-input"
      />
      {isDeletingContact ? (
        <Typography>{STRINGS[locale].CONTACTS_CANNOT_UNDO_MESSAGE}</Typography>
      ) : (
        <Typography
          variant="body2"
          color="error"
          style={{
            cursor: 'pointer',
          }}
          onClick={() => {
            setIsDeletingContact(true);
          }}
        >
          {STRINGS[locale].CONTACTS_DELETE_CONTACT_LABEL}
        </Typography>
      )}
    </>
  );
  const actionButtons = isDeletingContact ? (
    <>
      <DialogNeutralButton
        type="button"
        onClick={() => setIsDeletingContact(false)}
      >
        {STRINGS[locale].CONTACTS_CANCEL_LABEL}
      </DialogNeutralButton>
      <DialogErrorButton type="button" onClick={deleteContact}>
        {STRINGS[locale].CONTACTS_DELETE_LABEL}
      </DialogErrorButton>
    </>
  ) : (
    <DialogPrimaryButton type="submit" value="submit">
      {STRINGS[locale].CONTACTS_SAVE_LABEL}
    </DialogPrimaryButton>
  );

  return (
    <ContactsDialog
      open={open}
      onClose={onClose}
      onSubmit={updateContact}
      titleText={STRINGS[locale].CONTACTS_EDIT_CONTACT_HEADER}
      formFields={formFields}
      actionButtons={actionButtons}
      errorText={errorMessage}
      isInProgress={isRequestInFlight}
      avatarChoice={newContactAvatarChoice}
      setAvatarChoice={setNewContactAvatarChoice}
    />
  );
}

export default function ContactsPage({ locale }) {
  const [userState, userService] = useUserService();
  const { me: user } = userState;
  const [contactState, contactService] = useContactService();
  const { contacts = [], activeContact } = contactState;
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);

  useEffect(() => {
    if (userService) {
      userService.refreshSelf();
    }
  }, [userService]);
  // TODO change this up so that we don't have to keep supplying user id
  useEffect(() => {
    if (contactService && user) {
      contactService.refreshContacts(user.id);
    }
  }, [contactService, user]);

  if (!user) {
    return <Redirect to={PATHS.LOGIN} />;
  }
  if (activeContact) {
    return <Redirect to={PATHS.CALLING} />;
  }

  const logout = async () => {
    window.location = '/oauth/logout';
  };

  return (
    <Container
      style={{
        background: 'no-repeat url(/images/contacts_bg.svg) bottom center',
        backgroundSize: 'contain',
      }}
    >
      <Typography variant="h5" component="h1">
        {STRINGS[locale].CONTACTS_TITLE}
      </Typography>
      <Typography
        variant="body1"
        style={{
          marginBottom: '12px',
        }}
      >
        {STRINGS[locale].CONTACTS_SUBTITLE}
      </Typography>
      <Typography
        variant="body1"
        style={{
          marginBottom: '1rem',
        }}
      >
        {STRINGS[locale].CONTACTS_COUNTRY_LABEL(user.destinationCountry)}
      </Typography>
      <div
        style={{
          overflowY: 'scroll',
          width: '100%',
          // 12em to accomodate logout
          height: 'calc(100% - 16em)',
          padding: '0.5rem',
        }}
      >
        <List
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {contacts.map((contact) => (
            <ListItem
              key={contact.id}
              style={{
                marginBottom: '0.5rem',
                paddingBottom: '0',
                paddingTop: '0',
              }}
            >
              <ContactBox
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  height: '4em',
                  padding: '4px 8px',
                }}
                variant="outlined"
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: '1 0',
                    marginRight: '1rem',
                  }}
                >
                  <img
                    style={{
                      height: '2.5rem',
                      width: '2.5rem',
                      marginRight: '8px',
                    }}
                    alt=""
                    src={`/images/avatars/${
                      contact.avatar || 'placeholder'
                    }.svg`}
                  />
                  <div
                    style={{
                      flex: '1 0',
                    }}
                  >
                    <Typography variant="body1">{contact.name}</Typography>
                    <div style={{ display: 'flex' }}>
                      <Typography
                        style={{ fontSize: '0.675rem', marginRight: '0.5rem' }}
                        variant="body2"
                      >
                        {contact.phoneNumber}
                      </Typography>
                      <Typography
                        style={{ cursor: 'pointer', fontSize: '0.675rem' }}
                        color="primary"
                        role="button"
                        onClick={() => setContactToEdit(contact)}
                      >
                        {STRINGS[locale].CONTACTS_EDIT_LABEL}
                      </Typography>
                    </div>
                  </div>
                </div>
                <IconButton
                  style={{ padding: '0' }}
                  onClick={() => {
                    contactService.setActiveContact(contact);
                  }}
                >
                  <ContactCallIcon />
                </IconButton>
              </ContactBox>
            </ListItem>
          ))}
        </List>
      </div>
      {/* <ListItem> */}
      <AddContactButton
        style={{
          width: '100%',
          height: '4em',
          marginTop: '1em',
        }}
        variant="outlined"
        onClick={() => {
          setIsAddDialogOpen(true);
        }}
      >
        <AddContactIcon
          style={{
            marginRight: '1em',
            height: '1.5rem',
            width: '1.5rem',
          }}
        />
        <div>{STRINGS[locale].CONTACTS_ADD_CONTACT_LABEL}</div>
      </AddContactButton>
      {/* </ListItem> */}
      <LogoutLink
        variant="body1"
        color="primary"
        role="button"
        onClick={logout}
      >
        <ExitToAppIcon style={{ transform: 'rotate(180deg)' }} />
        Logout
      </LogoutLink>
      <AddContactDialog
        onClose={() => setIsAddDialogOpen(false)}
        open={isAddDialogOpen}
        locale={locale}
      />
      {contactToEdit ? (
        <EditContactDialog
          contact={contactToEdit}
          onClose={() => setContactToEdit(null)}
          open
          locale={locale}
        />
      ) : null}
    </Container>
  );
}
