import { noRedirectClient } from './apiClient';
import ObservableService from './observableService';

const allowlistEntryEndpoint = '/allowlistEntries';

export default class AllowlistService extends ObservableService {
  constructor() {
    super();
    this.state = {
      allowlistEntries: [],
    };
  }

  async refreshAllowlistEntries() {
    const allowlistEntries = await noRedirectClient.get(allowlistEntryEndpoint);
    this.state = {
      ...this.state,
      allowlistEntries,
    };
    this.notify();
  }

  async createAllowlistEntry({ phoneNumber, destinationCountry }) {
    await noRedirectClient.post(allowlistEntryEndpoint, {
      phoneNumber,
      destinationCountry,
    });
    return this.refreshAllowlistEntries();
  }

  async deleteAllowlistEntry(id) {
    await noRedirectClient.delete(`${allowlistEntryEndpoint}/${id}`);
    return this.refreshAllowlistEntries();
  }
}
