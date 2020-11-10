import type { PhoneNumberValidation as PhoneNumberValidationEntity } from '../models';

function PhoneNumberValidationService(
  PhoneNumberValidationModel: typeof PhoneNumberValidationEntity
) {
  async function getValidationStateByPhoneNumber(phoneNumber: string) {
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
    const conflictingValidationState = await getValidationStateByPhoneNumber(
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

  return {
    createPhoneNumberValidationForUser,
    getPhoneNumberValidationForUser,
    invalidateUser,
    updatePhoneNumberValidationRequestTime,
    updatePhoneNumberValidation,
    validateUser,
  };
}

export { PhoneNumberValidationService };
export default PhoneNumberValidationService;
