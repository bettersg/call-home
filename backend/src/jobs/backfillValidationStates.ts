import type { User, ValidationState } from '../services';

// TODO remove this once this has been run the first time
async function backfillValidationStates(
  userService: typeof User,
  validationStateService: typeof ValidationState
) {
  const allUsers = await userService.listUsers();
  allUsers.forEach(async (user) => {
    try {
      await validationStateService.createValidationStateForUser(user.id);
      await validationStateService.updateValidationState(user.id, {
        isPhoneNumberValidated: user.isPhoneNumberValidated,
      });
    } catch (e) {
      console.error(e);
    }
  });
}

export default backfillValidationStates;
