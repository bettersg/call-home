import apiClient from './apiClient';
import ObservableService from './observableService';

// TODO make this configurable
const userEndpoint = '/users';

export const UserTypes = {
  ADMIN: 'ADMIN',
  CALLER: 'CALLER',
};

export default class UserService extends ObservableService {
  constructor() {
    super();
    this.state = {
      users: [],
      me: null,
    };
  }

  async refreshAllUsers() {
    const users = await apiClient.get(userEndpoint);
    this.state = {
      ...this.state,
      users,
    };
    this.notify();
    return users;
  }

  async refreshSelf() {
    const me = await apiClient.get(`${userEndpoint}/me`);
    this.state = {
      ...this.state,
      me,
    };
    this.notify();
  }

  async createUser(user) {
    const result = await apiClient.post(`${userEndpoint}`, user);
    await this.refreshAllUsers();
    return result;
  }

  async updateUser(userEmail, newUser) {
    const result = await apiClient.put(`${userEndpoint}/${userEmail}`, newUser);
    await this.refreshAllUsers();
    return result;
  }

  async deleteUser(userEmail) {
    const result = await apiClient.delete(`${userEndpoint}/${userEmail}`);
    await this.refreshAllUsers();
    return result;
  }
}
