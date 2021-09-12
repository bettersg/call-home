// TODO for some reason, this file requires using the dist/ directory
import { Edge } from '@call-home/shared/dist/types/CallExperimentFlags';
import { noRedirectClient, UnauthenticatedError } from './apiClient';
import ObservableService from './observableService';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FeatureState {
  DORM_VALIDATION: boolean;
  EDGE_EXPERIMENT: Edge;
  FEEDBACK_DIALOG: boolean;
}

const featureEndpoint = '/features';

export default class FeatureService extends ObservableService<FeatureState> {
  constructor() {
    super();
    this.state = {
      DORM_VALIDATION: false,
      EDGE_EXPERIMENT: Edge.DEFAULT,
      FEEDBACK_DIALOG: false,
    };
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
