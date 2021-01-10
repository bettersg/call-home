import apiClient from './apiClient';
import ObservableService from './observableService';

// TODO make this configurable
const contactEndpoint = `/users/:userId/contacts`;

export interface ContactState {
  contacts: any[];
  activeContact: any;
}

function userContactEndpoint(userId: string) {
  return contactEndpoint.replace(':userId', userId);
}

export default class ContactService extends ObservableService<ContactState> {
  constructor() {
    super();
    this.state = {
      contacts: [],
      activeContact: null,
    };
  }

  async refreshContacts(userId: string) {
    const contacts = (await apiClient.get(userContactEndpoint(userId))) as any;
    this.state = {
      ...this.state,
      contacts,
    };
    this.notify();
    return contacts;
  }

  async createContact(userId: string, contact: any) {
    const result = await apiClient.post(userContactEndpoint(userId), contact);
    await this.refreshContacts(userId);
    return result;
  }

  async updateContact(userId: string, contactId: string, newContact: any) {
    const result = await apiClient.put(
      `${userContactEndpoint(userId)}/${contactId}`,
      newContact
    );
    await this.refreshContacts(userId);
    return result;
  }

  async deleteContact(userId: string, contactId: string) {
    const result = await apiClient.delete(
      `${userContactEndpoint(userId)}/${contactId}`
    );
    await this.refreshContacts(userId);
    return result;
  }

  // TODO make this an id
  setActiveContact(contact: any) {
    this.state = {
      ...this.state,
      activeContact: contact,
    };
    this.notify();
  }
}
