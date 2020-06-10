import apiClient from './apiClient';
import ObservableService from './observableService';

// TODO make this configurable
const userEndpoint = '/users';

export const UserTypes = {
  ADMIN: 'ADMIN',
  CALLER: 'CALLER',
  USER: 'USER',
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

  async logout() {
    this.state = {
      users: [],
      me: null,
    };
    this.notify();
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

  async updateUser(userId, newUser) {
    const result = await apiClient.put(`${userEndpoint}/${userId}`, newUser);
    await this.refreshAllUsers();
    return result;
  }

  async deleteUser(userId) {
    const result = await apiClient.delete(`${userEndpoint}/${userId}`);
    await this.refreshAllUsers();
    return result;
  }
}
