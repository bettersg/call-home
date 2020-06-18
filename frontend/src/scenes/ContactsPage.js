import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CallIcon from '@material-ui/icons/Call';
import Container from '../components/shared/Container';
import { ErrorButton, PrimaryButton } from '../components/shared/RoundedButton';
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
    CONTACTS_SUBTITLE: 'Call your loved ones back home for free',
    CONTACTS_ADD_CONTACT_LABEL: 'Add a loved one',
    CONTACTS_ADD_LABEL: 'Add',
    CONTACTS_COUNTRY_LABEL: (code) => `Country: ${COUNTRIES[code]}`,
    CONTACTS_NAME_LABEL: 'Name',
    CONTACTS_PHONE_NUMBER_LABEL: 'Phone number',
    CONTACTS_EDIT_CONTACT_HEADER: 'Edit',
    CONTACTS_EDIT_LABEL: 'Edit',
    CONTACTS_DELETE_LABEL: 'Delete',
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

const withDialogButtonStyles = withStyles(() => ({
  root: {
    padding: '1em 2em',
    flex: '1 0',
    margin: '0 0.5em',
  },
}));

const DialogPrimaryButton = withDialogButtonStyles(PrimaryButton);

const DialogErrorButton = withDialogButtonStyles(ErrorButton);

function AddContactDialog({ open, onClose, locale }) {
  const [userState] = useUserService();
  const { me: user } = userState;
  const [, contactService] = useContactService();
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhoneNumber, setNewContactPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setNewContactName('');
    setNewContactPhoneNumber('');
  }, [open]);

  const createContact = async () => {
    try {
      setErrorMessage(null);
      await contactService.createContact(user.id, {
        name: newContactName,
        phoneNumber: newContactPhoneNumber,
      });
      onClose();
    } catch (e) {
      if (e instanceof ApiValidationError) {
        const { code } = e;
        setErrorMessage(
          STRINGS[locale].errors[code] ||
            STRINGS[locale].CONTACTS_UNKNOWN_ERROR_MESSAGE
        );
      }
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
        onChange={(e) => setNewContactName(e.target.value)}
      />
      <TextField
        style={{
          marginBottom: '12px',
        }}
        fullWidth
        variant="outlined"
        label="Phone number"
        value={newContactPhoneNumber}
        onChange={(e) => setNewContactPhoneNumber(e.target.value)}
        InputProps={{
          inputComponent: PhoneNumberMasks[user.destinationCountry],
        }}
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
      actionButtons={actionButtons}
      errorText={errorMessage}
    />
  );
}

function EditContactDialog({ contact, open, onClose, locale }) {
  const [userState] = useUserService();
  const { me: user } = userState;
  const [, contactService] = useContactService();
  const [newContactName, setNewContactName] = useState(contact.name);
  const [newContactPhoneNumber, setNewContactPhoneNumber] = useState(
    contact.phoneNumber
  );
  const [errorMessage, setErrorMessage] = useState(null);

  const updateContact = async () => {
    try {
      setErrorMessage(null);
      await contactService.updateContact(user.id, contact.id, {
        name: newContactName,
        phoneNumber: newContactPhoneNumber,
      });
      onClose();
    } catch (e) {
      if (e instanceof ApiValidationError) {
        const { code } = e;
        setErrorMessage(
          STRINGS[locale].errors[code] ||
            STRINGS[locale].CONTACTS_UNKNOWN_ERROR_MESSAGE
        );
      }
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
        onChange={(e) => setNewContactName(e.target.value)}
      />
      <TextField
        style={{
          marginBottom: '12px',
        }}
        fullWidth
        variant="outlined"
        label={STRINGS[locale].CONTACTS_PHONE_NUMBER_LABEL}
        value={newContactPhoneNumber}
        onChange={(e) => setNewContactPhoneNumber(e.target.value)}
        InputProps={{
          inputComponent: PhoneNumberMasks[user.destinationCountry],
        }}
      />
    </>
  );
  const actionButtons = (
    <>
      <DialogErrorButton onClick={deleteContact}>
        {STRINGS[locale].CONTACTS_DELETE_LABEL}
      </DialogErrorButton>
      <DialogPrimaryButton type="submit" value="submit">
        {STRINGS[locale].CONTACTS_EDIT_LABEL}
      </DialogPrimaryButton>
    </>
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

  return (
    <Container>
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
          marginBottom: '24px',
        }}
      >
        {STRINGS[locale].CONTACTS_COUNTRY_LABEL(user.destinationCountry)}
      </Typography>
      <List
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {contacts.map((contact) => (
          <ListItem key={contact.id}>
            <ContactBox
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                width: '100%',
                height: '4em',
                marginBottom: '8px',
              }}
              variant="outlined"
            >
              <div>
                <Typography variant="body1">{contact.name}</Typography>
                <Typography
                  style={{ cursor: 'pointer' }}
                  color="primary"
                  role="button"
                  onClick={() => setContactToEdit(contact)}
                >
                  {STRINGS[locale].CONTACTS_EDIT_LABEL}
                </Typography>
              </div>
              <Typography variant="body2">{contact.phoneNumber}</Typography>
              <Button
                onClick={() => {
                  contactService.setActiveContact(contact);
                }}
              >
                <CallIcon />
              </Button>
            </ContactBox>
          </ListItem>
        ))}
        <ListItem>
          <AddContactButton
            style={{
              width: '100%',
              height: '4em',
            }}
            variant="outlined"
            onClick={() => {
              setIsAddDialogOpen(true);
            }}
          >
            <AddContactIcon
              style={{
                marginRight: '1em',
                height: '1.5em',
                width: '1.5em',
              }}
            />
            <div>{STRINGS[locale].CONTACTS_ADD_CONTACT_LABEL}</div>
          </AddContactButton>
        </ListItem>
      </List>
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