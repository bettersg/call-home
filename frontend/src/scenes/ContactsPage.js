import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Container from '../components/shared/Container';
import RoundedButton from '../components/shared/RoundedButton';
import { useUserService, useContactService } from '../contexts';

import SCENES from './enums';

export default function ContactsPage({ navigate }) {
  const [userState, userService] = useUserService();
  const { me: user } = userState;
  const [contactState, contactService] = useContactService();
  const { contacts = [] } = contactState;
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
    navigate(SCENES.LOGIN);
    return null;
  }

  const createContact = () => {
    contactService.createContact(user.id, {
      name: newContactName,
      phoneNumber: newContactPhoneNumber,
    });
  };

  return (
    <Container>
      <div>Call your loved ones back home for free</div>
      <RoundedButton
        onClick={() => {
          setIsDialogOpen(true);
        }}
      >
        Add a loved one
      </RoundedButton>
      {contacts.map((contact) => (
        <div key={contact.id}>
          <div>{contact.name}</div>
          <div>{contact.phoneNumber}</div>
          <RoundedButton
            onClick={() => {
              contactService.setActiveContact(contact);
              navigate(SCENES.CALLING_PAGE);
            }}
          >
            Call them
          </RoundedButton>
        </div>
      ))}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div>Add a loved one</div>
        <TextField
          fullWidth
          label="Name"
          value={newContactName}
          onChange={(e) => setNewContactName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Phone number"
          value={newContactPhoneNumber}
          onChange={(e) => setNewContactPhoneNumber(e.target.value)}
        />
        <RoundedButton
          onClick={async () => {
            await createContact();
            setIsDialogOpen(false);
          }}
        >
          ADD
        </RoundedButton>
      </Dialog>
    </Container>
  );
}
