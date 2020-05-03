import apiClient from './apiClient';
import ObservableService from './observableService';

// TODO make this configurable
const calleeEndpoint = '/callees';

export default class CalleeService extends ObservableService {
  constructor() {
    super();
    this.state = {
      callees: [],
    };
  }

  async refreshAllCallees() {
    const callees = await apiClient.get(`${calleeEndpoint}`);
    this.state = {
      ...this.state,
      callees,
    };
    this.notify();
    return callees;
  }

  async createCallee(callee) {
    const result = apiClient.post(`${calleeEndpoint}`, callee);
    this.refreshAllCallees();
    return result;
  }

  async updateCallee(calleeId, newCallee) {
    const result = await apiClient.put(
      `${calleeEndpoint}/${calleeId}`,
      newCallee
    );
    this.refreshAllCallees();
    return result;
  }

  async deleteCallee(calleeId) {
    const result = await apiClient.delete(`${calleeEndpoint}/${calleeId}`);
    this.refreshAllCallees();
    return result;
  }
}
