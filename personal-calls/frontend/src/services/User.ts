import { UserWalletResponse } from '@call-home/shared/types/User';
import NoSleep from 'nosleep.js';
import { noRedirectClient, UnauthenticatedError } from './apiClient';
import ObservableService from './observableService';

// TODO This is kind of a catch-all for everything the user does, but a whole rework of this is maybe too much effort.
export interface UserState {
  me: UserWalletResponse | null;
  verificationPhoneNumber: string | null;
  shouldSleep: boolean;
}

// TODO make this configurable
const userEndpoint = '/users';

export default class UserService extends ObservableService<UserState> {
  private static noSleep = new NoSleep();

  private static get shouldSleep() {
    // If noSleep is enabled, then we should NOT sleep.
    // Therefore, "shouldSleep" is the reverse of noSleep being enabled
    return !UserService.noSleep.isEnabled;
  }

  private static set shouldSleep(shouldSleep: boolean) {
    if (shouldSleep) {
      UserService.noSleep.disable();
    } else {
      UserService.noSleep.enable();
    }
  }

  constructor() {
    super();
    this.state = {
      me: null,
      verificationPhoneNumber: null,
      shouldSleep: UserService.shouldSleep,
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

  async setShouldSleep(shouldSleep: boolean): Promise<void> {
    UserService.shouldSleep = shouldSleep;
    this.state = {
      ...this.state,
      shouldSleep: UserService.shouldSleep,
    };
    this.notify();
  }
}
