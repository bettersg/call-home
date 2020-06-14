import React, { createContext, useContext, useEffect, useState } from 'react';
import { Contact as ContactService } from '../services';

const ContactServiceContext = createContext(null);
const ContactStateContext = createContext(null);

const contactService = new ContactService();

export function ContactServiceProvider({ children }) {
  const [contactState, setContactState] = useState({});

  useEffect(() => {
    if (contactService) {
      contactService.subscribe(setContactState);
    }
  }, [contactService]);

  return (
    <ContactServiceContext.Provider value={contactService}>
      <ContactStateContext.Provider value={contactState}>
        {children}
      </ContactStateContext.Provider>
    </ContactServiceContext.Provider>
  );
}

export function useContactService() {
  const innerContactService = useContext(ContactServiceContext);
  const contactState = useContext(ContactStateContext);
  return [contactState, innerContactService];
}
