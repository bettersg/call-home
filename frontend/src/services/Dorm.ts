import type { DormResponse } from '@call-home/shared/types/Dorm';

import apiClient from './apiClient';
import ObservableService from './observableService';

const dormEndpoint = '/dorms';

export interface Dorm {
  name: string;
}

export interface DormState {
  dorms: DormResponse[];
}

export default class DormService extends ObservableService<DormState> {
  constructor() {
    super();
    this.state = {
      dorms: [],
    };
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
}
