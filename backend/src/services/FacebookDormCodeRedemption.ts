import type {
  CodeRedemption,
  RedeemableCode,
  DormValidation,
  Transaction,
} from '.';
import type { CodeRedemptionRequest } from './CodeRedemption';
import { RedeemableCodeType } from '../models';

const FACEBOOK_DORM_ID = 1;
const FACEBOOK_CREDIT_AMOUNT = 50 * 60; // 50 minutes
const FACEBOOK_CLAIM_LIMIT = 1;

function FacebookDormCodeRedemption(
  codeRedemptionService: typeof CodeRedemption,
  redeemableCodeService: typeof RedeemableCode,
  dormValidationService: typeof DormValidation,
  transactionService: typeof Transaction
) {
  async function validateCodeRedemption(
    codeRedemptionRequest: CodeRedemptionRequest
  ) {
    const { code, userId } = codeRedemptionRequest;
    const redeemableCode = await redeemableCodeService.getRedeemableCodeByCode(
      code
    );

    if (!redeemableCode) {
      throw new Error('Validation Error: CODE_NOT_FOUND');
    }

    if (redeemableCode.codeType !== RedeemableCodeType.FACEBOOK_DORM) {
      throw new Error('Validation Error: WRONG_CODE_HANDLER');
    }

    const previousUserRedemptions = await codeRedemptionService.getRedemptionsForUser(
      userId
    );
    const redeemedCodes = await Promise.all(
      previousUserRedemptions.map((redemption) =>
        redeemableCodeService.getRedeemableCode(redemption.codeId)
      )
    );

    const numPreviousRedemptions = redeemedCodes.filter(
      (prevRedemption) => prevRedemption?.codeType === redeemableCode.codeType
    ).length;

    if (numPreviousRedemptions >= FACEBOOK_CLAIM_LIMIT) {
      throw new Error('Validation Error: USER_CODE_REDEMPTIONS_EXCEEDED');
    }
  }

  async function redeemCode(codeRedemptionRequest: CodeRedemptionRequest) {
    await validateCodeRedemption(codeRedemptionRequest);

    const createdRedemption = await codeRedemptionService.redeemCode(
      codeRedemptionRequest
    );

    const dormValidationPromise = dormValidationService.validateUser(
      createdRedemption.userId,
      FACEBOOK_DORM_ID
    );
    const transactionPromise = transactionService.createTransaction({
      userId: createdRedemption.userId,
      amount: FACEBOOK_CREDIT_AMOUNT,
      reference: 'redeemable-code-fb',
    });
    await Promise.all([dormValidationPromise, transactionPromise]);
  }

  return {
    redeemCode,
  };
}

export default FacebookDormCodeRedemption;
