import type { UserWalletResponse } from '@call-home/shared/types/User';
import type { TransactionResponse } from '@call-home/shared/types/Transaction';

import apiClient from './apiClient';
import ObservableService from './observableService';

const userEndpoint = '/users';
const transactionEndpoint = '/users/:userId/transactions';
const adminGrantedValidationEndpoint = '/admin-granted-validation';

export interface AdminState {
  users: UserWalletResponse[];
  userTransactions: TransactionResponse[];
}

function userTransactionEndpoint(userId: number) {
  return transactionEndpoint.replace(':userId', String(userId));
}

// TODO this is pretty much a dumping ground for endpoints that don't belong elsewhere, this should probably be a composite service.
export default class AdminService extends ObservableService<AdminState> {
  constructor() {
    super();
    this.state = {
      users: [],
      userTransactions: [],
    };
  }

  async getUsers(): Promise<UserWalletResponse[]> {
    const users = (await apiClient.get(
      `${userEndpoint}/`
    )) as UserWalletResponse[];
    this.state = {
      ...this.state,
      users,
    };
    this.notify();
    return users;
  }

  async refreshTransactions(userId: number): Promise<TransactionResponse[]> {
    const userTransactions = (await apiClient.get(
      userTransactionEndpoint(userId)
    )) as TransactionResponse[];
    this.state = {
      ...this.state,
      userTransactions,
    };
    this.notify();
    return userTransactions;
  }

  async createTransaction(
    userId: number,
    amount: number
  ): Promise<TransactionResponse> {
    const transaction = (await apiClient.post(userTransactionEndpoint(userId), {
      amount,
    })) as TransactionResponse;
    await this.refreshTransactions(userId);
    return transaction;
  }

  async grantSpecialAccess(userId: number): Promise<void> {
    await apiClient.post(adminGrantedValidationEndpoint, {
      userId,
    });
    await this.getUsers();
  }

  async revokeSpecialAccess(userId: number): Promise<void> {
    await apiClient.delete(`${adminGrantedValidationEndpoint}/${userId}`);
    await this.getUsers();
  }
}
