import { DateTime, Duration } from 'luxon';
import { Op } from 'sequelize';
import { sanitizeDbErrors } from './lib';
import type { PeriodicCredit as PeriodicCreditEntity } from '../models';
import type { TransactionService } from './Transaction';

const creditInterval = 'week';
const creditAmount = Duration.fromObject({ minutes: 75 });
const creditAmountSeconds = creditAmount.as('seconds');

function PeriodicCreditService(
  PeriodicCreditModel: typeof PeriodicCreditEntity,
  transactionService: TransactionService
) {
  function getLastUpdateEpoch() {
    return DateTime.local().startOf(creditInterval).toJSDate();
  }

  function getNextUpdateEpoch() {
    return DateTime.local()
      .plus({ [creditInterval]: 1 })
      .startOf(creditInterval)
      .toJSDate();
  }

  function getNextUpdateAmount() {
    return creditAmount.toFormat(`mm 'minutes'`);
  }

  async function getPeriodicCreditAfterEpoch(userId: number) {
    return PeriodicCreditModel.findOne({
      where: {
        userId,
        createdAt: {
          [Op.gt]: getLastUpdateEpoch(),
        },
      },
    });
  }

  async function tryCreatePeriodicCredit(userId: number) {
    // We don't create credits for users by default. We only credit users when they log in/interact with the app in some way. As such, we need to ensure that we only credit users once per period.
    // We do this by determining the start of a top up interval, the "epoch".
    // If the user has a credit that is later than the top up interval, the user does not get a credit.
    // Otherwise they get a credit.
    const latestPeriodicCredit = await getPeriodicCreditAfterEpoch(userId);
    if (latestPeriodicCredit) {
      return latestPeriodicCredit;
    }
    const periodicCredit = sanitizeDbErrors(() =>
      PeriodicCreditModel.create({
        userId,
        amount: creditAmountSeconds,
      })
    );
    await transactionService.createTransaction({
      userId,
      amount: creditAmountSeconds,
      reference: 'periodic-credit',
    });
    return periodicCredit;
  }

  return {
    tryCreatePeriodicCredit,
    getNextUpdateEpoch,
    getNextUpdateAmount,
  };
}

export { PeriodicCreditService };
export default PeriodicCreditService;
