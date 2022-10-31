import createServiceProvider from './createServiceProvider';
import { Allowlist } from '../services';

const { Provider: AllowlistServiceProvider, hook: useAllowlistService } =
  createServiceProvider(Allowlist);

export { AllowlistServiceProvider, useAllowlistService };
