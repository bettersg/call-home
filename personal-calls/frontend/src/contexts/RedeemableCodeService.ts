import createServiceProvider from './createServiceProvider';
import { RedeemableCode } from '../services';

const {
  Provider: RedeemableCodeServiceProvider,
  hook: useRedeemableCodeService,
} = createServiceProvider(RedeemableCode);

export { RedeemableCodeServiceProvider, useRedeemableCodeService };
