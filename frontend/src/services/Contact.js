import apiClient from './apiClient';
import ObservableService from './observableService';

// TODO make this configurable
const contactEndpoint = `/users/:userId/contacts`;

function userContactEndpoint(userId) {
  return contactEndpoint.replace(':userId', userId);
}

export default class ContactService extends ObservableService {
  constructor() {
    super();
    this.state = {
      contacts: [],
      activeContact: null,
    };
  }

  async refreshContacts(userId) {
    const contacts = await apiClient.get(userContactEndpoint(userId));
    this.state = {
      ...this.state,
      contacts,
    };
    this.notify();
    return contacts;
  }

  async createContact(userId, contact) {
    const result = await apiClient.post(userContactEndpoint(userId), contact);
    this.refreshContacts(userId);
    return result;
  }

  async updateContact(userId, contactId, newContact) {
    const result = await apiClient.put(
      `${userContactEndpoint(userId)}/${contactId}`,
      newContact
    );
    this.refreshContacts(userId);
    return result;
  }

  async deleteContact(userId, contactId) {
    const result = await apiClient.delete(
      `${userContactEndpoint(userId)}/${contactId}`
    );
    this.refreshContacts(userId);
    return result;
  }

  // TODO make this an id
  setActiveContact(contact) {
    this.state = {
      ...this.state,
      activeContact: contact,
    };
    this.notify();
  }
}
