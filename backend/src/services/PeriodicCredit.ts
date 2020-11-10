import { DateTime, Duration } from 'luxon';
import { Op } from 'sequelize';
import { sanitizeDbErrors } from './lib';
import type { PeriodicCredit as PeriodicCreditEntity } from '../models';
import type { TransactionService } from './Transaction';
import type { UserService } from './User';
import { shouldEnableCallLimits, getPeriodicCreditCohort } from './Feature';

const cohorts = {
  month: Duration.fromObject({ minutes: 200 }),
  week: Duration.fromObject({ minutes: 50 }),
};

function PeriodicCreditService(
  PeriodicCreditModel: typeof PeriodicCreditEntity,
  userService: ReturnType<typeof UserService>,
  transactionService: TransactionService
) {
  async function getUserCohort(userId: number) {
    const user = await userService.getUser(userId);
    const phoneNumber = user?.phoneNumber;
    if (!phoneNumber) {
      // Well, technically the user can also be not found
      throw new Error(
        `Cannot get periodic credit cohort for userId ${userId} because phone number cannot be found`
      );
    }
    return getPeriodicCreditCohort(phoneNumber);
  }

  function getLastUpdateEpoch(creditInterval: keyof typeof cohorts) {
    return DateTime.local().startOf(creditInterval).toJSDate();
  }

  function getNextUpdateEpoch(creditInterval: keyof typeof cohorts) {
    return DateTime.local()
      .plus({ [creditInterval]: 1 })
      .startOf(creditInterval)
      .toJSDate();
  }

  function getNextUpdateAmount(creditAmount: Duration) {
    return creditAmount.toFormat(`mm 'minutes'`);
  }

  async function getNextUpdateInfo(userId: number) {
    const creditInterval = await getUserCohort(userId);
    const creditAmount = cohorts[creditInterval];
    const [time, amount] = await Promise.all([
      getNextUpdateEpoch(creditInterval),
      getNextUpdateAmount(creditAmount),
    ]);
    return { time, amount };
  }

  async function getPeriodicCreditAfterEpoch(
    userId: number,
    creditInterval: keyof typeof cohorts
  ) {
    return PeriodicCreditModel.findOne({
      where: {
        userId,
        createdAt: {
          [Op.gt]: getLastUpdateEpoch(creditInterval),
        },
      },
    });
  }

  async function tryCreatePeriodicCredit(
    userId: number
  ): Promise<PeriodicCreditEntity | null> {
    if (!shouldEnableCallLimits(userId)) {
      return null;
    }
    // We don't create credits for users by default. We only credit users when they log in/interact with the app in some way. As such, we need to ensure that we only credit users once per period.
    // We do this by determining the start of a top up interval, the "epoch".
    // If the user has a credit that is later than the top up interval, the user does not get a credit.
    // Otherwise they get a credit.
    const creditInterval = await getUserCohort(userId);
    const creditAmountSeconds = cohorts[creditInterval].as('seconds');
    const latestPeriodicCredit = await getPeriodicCreditAfterEpoch(
      userId,
      creditInterval
    );
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
    getNextUpdateInfo,
  };
}

export { PeriodicCreditService };
export default PeriodicCreditService;
