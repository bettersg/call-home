import { sanitizeDbErrors } from './lib';
import type { CodeRedemption as CodeRedemptionEntity } from '../models';
import type { RedeemableCode } from '.';

export interface CodeRedemptionRequest {
  userId: number;
  code: string;
}

function CodeRedemptionService(
  CodeRedemptionModel: typeof CodeRedemptionEntity,
  redeemableCodeService: typeof RedeemableCode
) {
  async function getRedemptionsForCode(codeId: number) {
    return CodeRedemptionModel.findAll({
      where: {
        codeId,
      },
    });
  }

  async function getRedemptionsForUser(userId: number) {
    return CodeRedemptionModel.findAll({
      where: {
        userId,
      },
    });
  }

  async function redeemCode(codeRedemptionRequest: CodeRedemptionRequest) {
    const { userId, code } = codeRedemptionRequest;
    const redeemableCode = await redeemableCodeService.getRedeemableCodeByCode(
      code
    );
    if (!redeemableCode) {
      throw new Error('Validation Error: CODE_NOT_FOUND');
    }

    if (redeemableCode.redemptionLimit !== null) {
      const redemptions = await getRedemptionsForCode(redeemableCode.id);
      if (redemptions.length >= redeemableCode.redemptionLimit) {
        throw new Error('Validation Error: CODE_FULLY_REDEEMED');
      }
    }

    return sanitizeDbErrors(() =>
      CodeRedemptionModel.create({
        userId,
        codeId: redeemableCode.id,
      })
    );
  }

  return {
    redeemCode,
    getRedemptionsForCode,
    getRedemptionsForUser,
  };
}

export default CodeRedemptionService;
