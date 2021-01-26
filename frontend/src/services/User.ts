import { UserWalletResponse } from '@call-home/shared/types/User';
import { noRedirectClient, UnauthenticatedError } from './apiClient';
import ObservableService from './observableService';

export interface UserState {
  me: UserWalletResponse | null;
  verificationPhoneNumber: string | null;
}

// TODO make this configurable
const userEndpoint = '/users';

export default class UserService extends ObservableService<UserState> {
  constructor() {
    super();
    this.state = {
      me: null,
      verificationPhoneNumber: null,
    };
  }

  async logout(): Promise<void> {
    this.state.me = null;
    this.notify();
  }

  async refreshSelf(): Promise<void> {
    try {
      const me = (await noRedirectClient.get(
        `${userEndpoint}/me`
      )) as UserWalletResponse;
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

  async setPhoneNumber(verificationPhoneNumber: string): Promise<void> {
    this.state = {
      ...this.state,
      verificationPhoneNumber,
    };
    this.notify();
  }
}
