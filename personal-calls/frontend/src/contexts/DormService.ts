import createServiceProvider from './createServiceProvider';
import { Dorm } from '../services';

const { Provider: DormServiceProvider, hook: useDormService } =
  createServiceProvider(Dorm);

export { DormServiceProvider, useDormService };
