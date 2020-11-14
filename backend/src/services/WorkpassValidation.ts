import crypto from 'crypto';
import type { WorkpassValidation as WorkpassValidationEntity } from '../models';
import type { WorkpassClient } from './index';
import type { WorkpassStatus } from './WorkpassClient';

function hashSha256(data: string): string {
  return crypto
    .createHash('sha256')
    .update(Buffer.from(data, 'utf8'))
    .digest('base64');
}

interface WorkpassValidationResult {
  result: 'success' | 'failure';
  reason?: {
    workpassStatus: WorkpassStatus;
    code?: 'conflict' | 'bad-status' | 'bad-expiry';
  };
}

function WorkpassValidationService(
  WorkpassValidationModel: typeof WorkpassValidationEntity,
  workpassClient: typeof WorkpassClient
) {
  async function getValidationBySerialNumberSha256(serialNumberSha256: string) {
    return WorkpassValidationModel.findOne({
      where: {
        serialNumberSha256,
      },
    });
  }

  async function createWorkpassValidationForUser(userId: number) {
    const currentWorkpassValidation = await WorkpassValidationModel.findOne({
      where: {
        userId,
      },
    });
    if (currentWorkpassValidation) {
      return currentWorkpassValidation;
    }
    return WorkpassValidationModel.create({ userId });
  }

  async function getWorkpassValidationForUser(userId: number) {
    return WorkpassValidationModel.findOne({
      where: {
        userId,
      },
    });
  }

  async function updateWorkpassValidation(
    userId: number,
    validationState: Partial<WorkpassValidationEntity>
  ) {
    return WorkpassValidationModel.update(validationState, {
      where: { userId },
    });
  }

  async function updateWorkpassValidationRequestTime(userId: number) {
    const updateTime = new Date();
    await updateWorkpassValidation(userId, { lastRequestTime: updateTime });
    return updateTime;
  }

  // TODO invalidate a user when their workpass is expired
  // Define a simple pair of functions that will validate/invalidate a user
  async function invalidateUser(userId: number) {
    return updateWorkpassValidation(userId, {
      isWorkpassValidated: false,
      serialNumberSha256: null,
      // Preserve the expiry date
    });
  }

  async function validateUser(
    userId: number,
    serialNumber: string
  ): Promise<WorkpassValidationResult> {
    const [serialNumberValidationResult, requestTime] = await Promise.all([
      workpassClient.getSerialNumberStatus(serialNumber),
      updateWorkpassValidationRequestTime(userId),
    ]);

    const { status: workpassStatus, expiry } = serialNumberValidationResult;

    if (workpassStatus !== 'valid') {
      return {
        result: 'failure',
        reason: {
          code: 'bad-status',
          workpassStatus,
        },
      };
    }
    if (expiry === null) {
      return {
        result: 'failure',
        reason: {
          code: 'bad-expiry',
          workpassStatus,
        },
      };
    }

    const serialNumberSha256 = hashSha256(serialNumber);
    const existingWorkpassUser = await getValidationBySerialNumberSha256(
      serialNumberSha256
    );
    if (existingWorkpassUser) {
      return {
        result: 'failure',
        reason: {
          code: 'conflict',
          workpassStatus,
        },
      };
    }

    await updateWorkpassValidation(userId, {
      serialNumberSha256,
      expiryDate: expiry.toJSDate(),
      lastFetched: requestTime,
    });
    return {
      result: 'success',
    };
  }

  return {
    createWorkpassValidationForUser,
    getWorkpassValidationForUser,
    validateUser,
    invalidateUser,
  };
}

export { WorkpassValidationService };
export default WorkpassValidationService;
