import apiClient from './apiClient';
import ObservableService from './observableService';

const allowlistEntryEndpoint = '/allowlistEntries';

interface AllowlistState {
  allowlistEntries: any[];
}

export default class AllowlistService extends ObservableService<AllowlistState> {
  constructor() {
    super();
    this.state = {
      allowlistEntries: [],
    };
  }

  async refreshAllowlistEntries() {
    const allowlistEntries = (await apiClient.get(
      allowlistEntryEndpoint
    )) as any[];
    this.state = {
      ...this.state,
      allowlistEntries,
    };
    this.notify();
  }

  async createAllowlistEntry({
    phoneNumber,
    destinationCountry,
  }: {
    phoneNumber: string;
    destinationCountry: string;
  }) {
    await apiClient.post(allowlistEntryEndpoint, {
      phoneNumber,
      destinationCountry,
    });
    return this.refreshAllowlistEntries();
  }

  async deleteAllowlistEntry(id: string) {
    await apiClient.delete(`${allowlistEntryEndpoint}/${id}`);
    return this.refreshAllowlistEntries();
  }
}
