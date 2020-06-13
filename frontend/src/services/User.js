import { noRedirectClient, UnauthenticatedError } from './apiClient';
import ObservableService from './observableService';

// TODO make this configurable
const userEndpoint = '/users';

export default class UserService extends ObservableService {
  constructor() {
    super();
    this.state = {
      users: [],
      me: null,
    };
  }

  async logout() {
    this.state = {
      users: [],
      me: null,
    };
    this.notify();
  }

  async refreshSelf() {
    try {
      const me = await noRedirectClient.get(`${userEndpoint}/me`);
      this.state = {
        ...this.state,
        me,
      };
      this.notify();
    } catch (e) {
      if (e instanceof UnauthenticatedError) {
        return;
      }
      throw e;
    }
  }
}
