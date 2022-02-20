import createServiceProvider from './createServiceProvider';
import { Feature } from '../services';

const { Provider: FeatureServiceProvider, hook: useFeatureService } =
  createServiceProvider(Feature);

export { FeatureServiceProvider, useFeatureService };
