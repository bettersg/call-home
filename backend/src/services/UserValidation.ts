import type {
  AdminGrantedValidation as AdminGrantedValidationEntity,
  DormValidation as DormValidationEntity,
  PhoneNumberValidation as PhoneNumberValidationEntity,
  WorkpassValidation as WorkpassValidationEntity,
} from '../models';
import type {
  AdminGrantedValidation,
  DormValidation,
  PhoneNumberValidation,
  WorkpassValidation,
  Feature,
} from '.';

export interface VerificationCollection {
  phoneNumber: PhoneNumberValidationEntity | null;
  workpass: WorkpassValidationEntity | null;
  dorm: DormValidationEntity | null;
  adminGranted: AdminGrantedValidationEntity | null;
}

export interface VerificationState {
  phoneNumber: boolean;
  workpass: boolean;
  dorm: boolean;
  adminGranted: boolean;
}

export interface UserVerifications {
  verifications: VerificationCollection;
  state: VerificationState;
}

function UserValidationService(
  featureService: typeof Feature,
  adminGrantedValidationService: typeof AdminGrantedValidation,
  dormValidationService: typeof DormValidation,
  phoneNumberValidationService: typeof PhoneNumberValidation,
  workpassValidationService: typeof WorkpassValidation
): {
  getVerificationsForUser: (userId: number) => Promise<UserVerifications>;
  isUserVerified: (
    userId: number,
    verificationState?: VerificationState
  ) => Promise<boolean>;
} {
  async function getVerificationsForUser(
    userId: number
  ): Promise<UserVerifications> {
    const [
      phoneNumberValidation,
      workpassValidation,
      dormValidation,
      adminGrantedValidation,
    ] = await Promise.all([
      phoneNumberValidationService.getPhoneNumberValidationForUser(userId),
      workpassValidationService.getWorkpassValidationForUser(userId),
      dormValidationService.getDormValidationForUser(userId),
      adminGrantedValidationService.getAdminGrantedValidationForUser(userId),
    ]);

    return {
      verifications: {
        phoneNumber: phoneNumberValidation,
        workpass: workpassValidation,
        dorm: dormValidation,
        adminGranted: adminGrantedValidation,
      },
      state: {
        phoneNumber: phoneNumberValidation?.isPhoneNumberValidated || false,
        workpass: workpassValidation?.isWorkpassValidated || false,
        dorm: Boolean(dormValidation),
        adminGranted: Boolean(adminGrantedValidation),
      },
    };
  }

  async function isUserVerified(
    userId: number,
    maybeVerificationState?: VerificationState
  ): Promise<boolean> {
    let verificationState = maybeVerificationState;
    if (!verificationState) {
      verificationState = (await getVerificationsForUser(userId)).state;
    }
    if (verificationState.adminGranted) {
      return true;
    }

    if (featureService.shouldEnableDormValidation()) {
      return (
        verificationState.phoneNumber &&
        verificationState.workpass &&
        verificationState.dorm
      );
    }
    return verificationState.phoneNumber && verificationState.workpass;
  }

  return {
    getVerificationsForUser,
    isUserVerified,
  };
}

export default UserValidationService;
