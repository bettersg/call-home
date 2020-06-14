import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CallIcon from '@material-ui/icons/Call';
import Container from '../components/shared/Container';
import { PrimaryButton } from '../components/shared/RoundedButton';
import { useUserService, useContactService } from '../contexts';

import PATHS from './paths';

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
  },
};

const AddContactButton = withStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.grey.light}`,
  },
}))(Button);

const ContactBox = withStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.grey.light}`,
  },
}))(Box);

export default function ContactsPage({ locale }) {
  const [userState, userService] = useUserService();
  const { me: user } = userState;
  const [contactState, contactService] = useContactService();
  const { contacts = [], activeContact } = contactState;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhoneNumber, setNewContactPhoneNumber] = useState('');

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

  const createContact = () => {
    contactService.createContact(user.id, {
      name: newContactName,
      phoneNumber: newContactPhoneNumber,
    });
  };

  return (
    <Container>
      <Typography variant="h5" component="h1">
        {STRINGS[locale].CONTACTS_TITLE}
      </Typography>
      <Typography variant="body1">
        {STRINGS[locale].CONTACTS_SUBTITLE}
      </Typography>
      <Typography variant="body1">
        {STRINGS[locale].CONTACTS_COUNTRY_LABEL(user.destinationCountry)}
      </Typography>
      {contacts.map((contact) => (
        <ContactBox
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
          variant="outlined"
          key={contact.id}
        >
          <Typography variant="body1">{contact.name}</Typography>
          <Typography variant="body2">{contact.phoneNumber}</Typography>
          <Button
            onClick={() => {
              contactService.setActiveContact(contact);
            }}
          >
            <CallIcon />
          </Button>
        </ContactBox>
      ))}
      <AddContactButton
        variant="outlined"
        onClick={() => {
          setIsDialogOpen(true);
        }}
      >
        <AddIcon /> {STRINGS[locale].CONTACTS_ADD_CONTACT_LABEL}
      </AddContactButton>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <form
          onSubmit={async () => {
            await createContact();
            setIsDialogOpen(false);
          }}
        >
          <div
            style={{
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '90vh',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Typography
                style={{
                  marginBottom: '12px',
                }}
                variant="h5"
                component="h2"
              >
                {STRINGS[locale].CONTACTS_ADD_CONTACT_LABEL}
              </Typography>
              <TextField
                style={{
                  marginBottom: '12px',
                }}
                fullWidth
                variant="outlined"
                label="Name"
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
            <PrimaryButton type="submit" value="submit">
              {STRINGS[locale].CONTACTS_ADD_LABEL}
            </PrimaryButton>
          </div>
        </form>
      </Dialog>
    </Container>
  );
}
