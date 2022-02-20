import createServiceProvider from './createServiceProvider';
import { Contact } from '../services';

const { Provider: ContactServiceProvider, hook: useContactService } =
  createServiceProvider(Contact);

export { ContactServiceProvider, useContactService };
