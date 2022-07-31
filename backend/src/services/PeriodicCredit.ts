import { DateTime, Duration } from 'luxon';
import { Op } from 'sequelize';
import { sanitizeDbErrors } from './lib';
import type {
  PeriodicCredit as PeriodicCreditEntity,
  Wallet as WalletEntity,
} from '../models';
import type {
  Feature as FeatureService,
  PhoneNumberValidation,
  Transaction,
} from '.';

import { logger } from '../config';
import { shouldEnableCreditCap } from './Feature';

// Config object for handling multiple credit intervals for users. No longer necessary.
const cohorts = {
  month: Duration.fromObject({ minutes: 80 }),
};

const CREDIT_INTERVAL = 'month';

function PeriodicCreditService(
  PeriodicCreditModel: typeof PeriodicCreditEntity,
  WalletModel: typeof WalletEntity,
  featureService: typeof FeatureService,
  transactionService: typeof Transaction
) {
  function getLastUpdateEpoch(creditInterval: keyof typeof cohorts) {
    return DateTime.local().startOf(creditInterval).toJSDate();
  }

  function getNextUpdateEpoch(creditInterval: keyof typeof cohorts) {
    return DateTime.local()
      .plus({ [creditInterval]: 1 })
      .startOf(creditInterval)
      .toJSDate();
  }

  async function getNextUpdateInfo(userId: number) {
    return {
      timeAsIso: getNextUpdateEpoch(CREDIT_INTERVAL).toISOString(),
      amountAsMinutes: cohorts[CREDIT_INTERVAL].as('minutes'),
    };
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
    // We don't create credits for users by default. We only credit users when they log in/interact with the app in some way. As such, we need to ensure that we only credit users once per period.
    // We do this by determining the start of a top up interval, the "epoch".
    // If the user has a credit that is later than the top up interval, the user does not get a credit.
    // Otherwise they get a credit.
    const periodicAmount = cohorts[CREDIT_INTERVAL].as('seconds');
    let creditAmountSeconds: number = periodicAmount;
    if (shouldEnableCreditCap()) {
      const userWallet = await WalletModel.findOne({
        where: {
          userId,
        },
      });
      // Something went wrong
      if (!userWallet) {
        logger.error('Failed to get wallet for user %d', userId);
        throw new Error(`Failed to get wallet for user ${userId}`);
      }
      creditAmountSeconds = Math.min(
        periodicAmount - userWallet.callTime,
        periodicAmount
      );
    }
    const latestPeriodicCredit = await getPeriodicCreditAfterEpoch(
      userId,
      CREDIT_INTERVAL
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
    logger.info('Created periodic credit %s', periodicCredit);
    await transactionService.createTransaction({
      userId,
      amount: creditAmountSeconds,
      reference: 'periodic-credit',
      additionalReference: null,
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
