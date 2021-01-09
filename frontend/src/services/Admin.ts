import type { UserWalletResponse } from '@call-home/shared/types/User';
import type { TransactionResponse } from '@call-home/shared/types/Transaction';
import type { DormResponse } from '@call-home/shared/types/Dorm';

import apiClient from './apiClient';
import ObservableService from './observableService';

const userEndpoint = '/users';
const transactionEndpoint = '/users/:userId/transactions';
const adminGrantedValidationEndpoint = '/admin-granted-validation';
const dormEndpoint = '/dorms';

export interface AdminState {
  users: UserWalletResponse[];
  userTransactions: TransactionResponse[];
  dorms: DormResponse[];
}

export interface Dorm {
  name: string;
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
      dorms: [],
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

  async refreshDorms(): Promise<DormResponse[]> {
    const dorms = (await apiClient.get(dormEndpoint)) as DormResponse[];
    this.state = {
      ...this.state,
      dorms,
    };
    this.notify();
    return dorms;
  }

  async createDorm({ name }: Dorm): Promise<DormResponse> {
    const newDorm = (await apiClient.post(dormEndpoint, {
      name,
    })) as DormResponse;
    this.refreshDorms();
    return newDorm;
  }

  async updateDorm(dormId: number, dorm: Partial<Dorm>): Promise<DormResponse> {
    const updatedDorm = (await apiClient.put(
      `${dormEndpoint}/${dormId}`,
      dorm
    )) as DormResponse;
    this.refreshDorms();
    return updatedDorm;
  }

  async deleteDorm(dormId: number): Promise<void> {
    await apiClient.delete(`${dormEndpoint}/${dormId}`);
    this.refreshDorms();
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
