import crypto from 'crypto';
import validateFIN, { FinResult } from '../util/VerifyFIN';
import type { FinValidation as FinValidationEntity } from '../models';

// TODO this is duped from ./WorkpassValidation and may be worth deduping.

function hashSha256(data: string): string {
  return crypto
    .createHash('sha256')
    .update(Buffer.from(data, 'utf8'))
    .digest('base64');
}

function FinValidationService(FinValidationModel: typeof FinValidationEntity) {
  async function getValidationByFinSha256(finSha256: string) {
    return FinValidationModel.findOne({
      where: {
        finSha256,
      },
    });
  }

  async function createFinValidationForUser(userId: number) {
    const currentFinValidation = await FinValidationModel.findOne({
      where: {
        userId,
      },
    });
    if (currentFinValidation) {
      return currentFinValidation;
    }
    return FinValidationModel.create({ userId });
  }

  async function getFinValidationForUser(userId: number) {
    return FinValidationModel.findOne({
      where: {
        userId,
      },
    });
  }

  async function updateFinValidation(
    userId: number,
    validationState: Partial<FinValidationEntity>
  ) {
    return FinValidationModel.update(validationState, {
      where: { userId },
    });
  }

  // Define a simple pair of functions that will validate/invalidate a user
  async function invalidateUser(userId: number) {
    return updateFinValidation(userId, {
      isFinValidated: false,
      finSha256: null,
    });
  }

  async function validateUser(userId: number, fin: string): Promise<FinResult> {
    const finValidation = await createFinValidationForUser(userId);
    const finResult = validateFIN(fin)

    if (finResult !== 'VALID') {
      return finResult;
    }
    const finSha256 = hashSha256(fin.toUpperCase());
    const existingFinUser = await getValidationByFinSha256(finSha256);
    if (existingFinUser) {
      await invalidateUser(existingFinUser.userId);
    }
    await updateFinValidation(userId, {
      finSha256,
      isFinValidated: true,
    });
    return finResult;
  }

  return {
    createFinValidationForUser,
    getFinValidationForUser,
    validateUser,
    invalidateUser,
  };
}

export { FinValidationService };
export default FinValidationService;
