import { UserWalletResponse } from '@call-home/shared/types/User';
import { noRedirectClient, UnauthenticatedError } from './apiClient';
import ObservableService from './observableService';

export interface UserState {
  me: UserWalletResponse | null;
  verificationPhoneNumber: string | null;
  shouldDismissWorkpassModal: boolean;
}

// TODO make this configurable
const userEndpoint = '/users';

export default class UserService extends ObservableService<UserState> {
  constructor() {
    super();
    this.state = {
      me: null,
      verificationPhoneNumber: null,
      // TODO This isn't the best place to keep this, but this is probably better solved at a later time
      shouldDismissWorkpassModal: false,
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

  setShouldDismissWorkpasssModal(shouldDismissWorkpassModal: boolean): void {
    this.state = {
      ...this.state,
      shouldDismissWorkpassModal,
    };
    this.notify();
  }
}
