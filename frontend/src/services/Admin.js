import apiClient from './apiClient';
import ObservableService from './observableService';

const userEndpoint = '/users';
const transactionEndpoint = '/users/:userId/transactions';
const adminGrantedValidationEndpoint = '/admin-granted-validation';

function userTransactionEndpoint(userId) {
  return transactionEndpoint.replace(':userId', userId);
}

// TODO this is pretty much a dumping ground for endpoints that don't belong elsewhere, this should probably be a composite service.
export default class AdminService extends ObservableService {
  constructor() {
    super();
    this.state = {
      users: [],
      userTransactions: [],
    };
  }

  async getUsers() {
    const users = await apiClient.get(`${userEndpoint}/`);
    this.state = {
      ...this.state,
      users,
    };
    this.notify();
    return users;
  }

  async refreshTransactions(userId) {
    const userTransactions = await apiClient.get(
      userTransactionEndpoint(userId)
    );
    this.state = {
      ...this.state,
      userTransactions,
    };
    this.notify();
    return userTransactions;
  }

  async createTransaction(userId, amount) {
    const transaction = await apiClient.post(userTransactionEndpoint(userId), {
      amount,
    });
    await this.refreshTransactions(userId);
    return transaction;
  }

  async grantSpecialAccess(userId) {
    await apiClient.post(adminGrantedValidationEndpoint, {
      userId,
    });
    await this.getUsers();
  }

  async revokeSpecialAccess(userId) {
    await apiClient.delete(`${adminGrantedValidationEndpoint}/${userId}`);
    await this.getUsers();
  }
}
