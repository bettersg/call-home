import createServiceProvider from './createServiceProvider';
import { Admin } from '../services';

const {
  Provider: AdminServiceProvider,
  hook: useAdminService,
} = createServiceProvider(Admin);

export { AdminServiceProvider, useAdminService };
