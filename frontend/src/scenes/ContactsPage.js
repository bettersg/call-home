import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CallIcon from '@material-ui/icons/Call';
import Container from '../components/shared/Container';
import { ErrorButton, PrimaryButton } from '../components/shared/RoundedButton';
import { useUserService, useContactService } from '../contexts';
import PATHS from './paths';

import './ContactsPage.css';

const COUNTRIES = {
  sg: '🇸🇬Singapore',
  bd: '🇧🇩Bangladesh',
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

  useEffect(() => {
    setNewContactName('');
    setNewContactPhoneNumber('');
  }, [open]);

  const createContact = () => {
    contactService.createContact(user.id, {
      name: newContactName,
      phoneNumber: newContactPhoneNumber,
    });
  };

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
        {STRINGS[locale].CONTACTS_ADD_CONTACT_LABEL}
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={async () => {
            await createContact();
            onClose();
          }}
          className="contacts-dialog-content"
        >
          <div className="contacts-dialog-form-fields">
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
            />
          </div>
          <div className="contacts-dialog-actions">
            <DialogPrimaryButton type="submit" value="submit">
              {STRINGS[locale].CONTACTS_ADD_LABEL}
            </DialogPrimaryButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
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

  const updateContact = async () => {
    await contactService.updateContact(user.id, contact.id, {
      name: newContactName,
      phoneNumber: newContactPhoneNumber,
    });
    onClose();
  };

  const deleteContact = async () => {
    await contactService.deleteContact(user.id, contact.id);
    onClose();
  };

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
        {STRINGS[locale].CONTACTS_EDIT_CONTACT_HEADER}
      </DialogTitle>
      <DialogContent>
        <form className="contacts-dialog-content" onSubmit={updateContact}>
          <div className="contacts-dialog-form-fields">
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
            />
          </div>
          <div className="contacts-dialog-actions">
            <DialogErrorButton onClick={deleteContact}>
              {STRINGS[locale].CONTACTS_DELETE_LABEL}
            </DialogErrorButton>
            <DialogPrimaryButton type="submit" value="submit">
              {STRINGS[locale].CONTACTS_EDIT_LABEL}
            </DialogPrimaryButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
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
