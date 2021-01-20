import { noRedirectClient, UnauthenticatedError } from './apiClient';
import ObservableService from './observableService';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FeatureState {}

const featureEndpoint = '/features';

export default class FeatureService extends ObservableService<FeatureState> {
  constructor() {
    super();
    this.state = {};
  }

  async refreshFeatures(): Promise<FeatureState> {
    try {
      const features = (await noRedirectClient.get(
        `${featureEndpoint}/`
      )) as FeatureState;
      this.state = features;
      this.notify();
      return this.state;
    } catch (e) {
      if (e instanceof UnauthenticatedError) {
        return this.state;
      }
      throw e;
    }
  }
}
