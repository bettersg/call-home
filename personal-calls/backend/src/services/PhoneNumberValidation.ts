import { DateTime, Duration } from 'luxon';
import { Op } from 'sequelize';
import type { PhoneNumberValidation as PhoneNumberValidationEntity } from '../models';

const VALIDITY_LENGTH: Duration = Duration.fromObject({
  month: 1,
});
const EXPIRY_BATCH_SIZE = 100;

function PhoneNumberValidationService(
  PhoneNumberValidationModel: typeof PhoneNumberValidationEntity
) {
  async function getValidationByPhoneNumber(phoneNumber: string) {
    return PhoneNumberValidationModel.findOne({
      where: {
        phoneNumber,
      },
    });
  }

  async function createPhoneNumberValidationForUser(userId: number) {
    const currentValidationState = await PhoneNumberValidationModel.findOne({
      where: {
        userId,
      },
    });
    if (currentValidationState) {
      return currentValidationState;
    }
    return PhoneNumberValidationModel.create({ userId });
  }

  async function getPhoneNumberValidationForUser(userId: number) {
    return PhoneNumberValidationModel.findOne({
      where: {
        userId,
      },
    });
  }

  async function updatePhoneNumberValidation(
    userId: number,
    validationState: Partial<PhoneNumberValidationEntity>
  ) {
    return PhoneNumberValidationModel.update(validationState, {
      where: { userId },
    });
  }

  async function updatePhoneNumberValidationRequestTime(userId: number) {
    return updatePhoneNumberValidation(userId, { lastRequestTime: new Date() });
  }

  // Define a simple pair of functions that will validate/invalidate a user
  async function invalidateUser(userId: number) {
    return updatePhoneNumberValidation(userId, {
      phoneNumber: null,
      isPhoneNumberValidated: false,
    });
  }

  async function validateUser(userId: number, phoneNumber: string) {
    const conflictingValidationState = await getValidationByPhoneNumber(
      phoneNumber
    );
    if (conflictingValidationState) {
      await invalidateUser(conflictingValidationState.userId);
    }
    return updatePhoneNumberValidation(userId, {
      phoneNumber,
      isPhoneNumberValidated: true,
    });
  }

  async function invalidateExpiredEntries() {
    const expiryDate: Date = DateTime.now().minus(VALIDITY_LENGTH).toJSDate();
    const expiredEntries = await PhoneNumberValidationModel.findAll({
      where: {
        updatedAt: {
          // Less than because the expired entries are earlier than our cutoff.
          [Op.lt]: expiryDate,
        },
      },
    });

    // Expire these in batches
    await Promise.all(
      expiredEntries
        .slice(0, EXPIRY_BATCH_SIZE)
        .map((phoneNumberValidation) =>
          invalidateUser(phoneNumberValidation.userId)
        )
    );
  }

  return {
    createPhoneNumberValidationForUser,
    getPhoneNumberValidationForUser,
    invalidateUser,
    invalidateExpiredEntries,
    updatePhoneNumberValidationRequestTime,
    updatePhoneNumberValidation,
    validateUser,
  };
}

export { PhoneNumberValidationService };
export default PhoneNumberValidationService;
