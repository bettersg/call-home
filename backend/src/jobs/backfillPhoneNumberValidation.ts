import type { User, PhoneNumberValidation } from '../services';

// TODO remove this once this has been run the first time
async function backfillPhoneNumberValidation(
  userService: typeof User,
  phoneNumberValidationService: typeof PhoneNumberValidation
) {
  const allUsers = await userService.listUsers();
  allUsers.forEach(async (user) => {
    try {
      await phoneNumberValidationService.createPhoneNumberValidationForUser(
        user.id
      );
      await phoneNumberValidationService.updatePhoneNumberValidation(user.id, {
        phoneNumber: user.phoneNumber,
        isPhoneNumberValidated: user.isPhoneNumberValidated,
      });
    } catch (e) {
      console.error(e);
    }
  });
}

export default backfillPhoneNumberValidation;
