import type { ValidationState as ValidationStateEntity } from '../models';

function ValidationStateService(
  ValidationStateModel: typeof ValidationStateEntity
) {
  async function createValidationStateForUser(userId: number) {
    const currentValidationState = await ValidationStateModel.findOne({
      where: {
        userId,
      },
    });
    if (currentValidationState) {
      return currentValidationState;
    }
    return ValidationStateModel.create({ userId });
  }

  async function getValidationStateForUser(userId: number) {
    return ValidationStateModel.findOne({
      where: {
        userId,
      },
    });
  }

  async function updateValidationState(
    userId: number,
    validationState: Partial<ValidationStateEntity>
  ) {
    return ValidationStateModel.update(validationState, { where: { userId } });
  }

  return {
    createValidationStateForUser,
    getValidationStateForUser,
    updateValidationState,
  };
}

export { ValidationStateService };
export default ValidationStateService;
