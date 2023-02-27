import type {
  AdminGrantedValidation as AdminGrantedValidationEntity,
  DormValidation as DormValidationEntity,
  FinValidation as FinValidationEntity,
  PhoneNumberValidation as PhoneNumberValidationEntity,
  WorkpassValidation as WorkpassValidationEntity,
} from '../models';
import type {
  AdminGrantedValidation,
  DormValidation,
  FinValidation,
  PhoneNumberValidation,
  WorkpassValidation,
  Feature,
} from '.';

export interface VerificationCollection {
  phoneNumber: PhoneNumberValidationEntity | null;
  workpass: WorkpassValidationEntity | null;
  dorm: DormValidationEntity | null;
  adminGranted: AdminGrantedValidationEntity | null;
  fin: FinValidationEntity | null;
}

export interface VerificationState {
  phoneNumber: boolean;
  workpass: boolean;
  dorm: boolean;
  adminGranted: boolean;
  fin: boolean;
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
  finValidationService: typeof FinValidation,
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
      finValidation,
    ] = await Promise.all([
      phoneNumberValidationService.getPhoneNumberValidationForUser(userId),
      workpassValidationService.getWorkpassValidationForUser(userId),
      dormValidationService.getDormValidationForUser(userId),
      adminGrantedValidationService.getAdminGrantedValidationForUser(userId),
      finValidationService.getFinValidationForUser(userId),
    ]);

    return {
      verifications: {
        phoneNumber: phoneNumberValidation,
        workpass: workpassValidation,
        dorm: dormValidation,
        adminGranted: adminGrantedValidation,
        fin: finValidation,
      },
      state: {
        phoneNumber: phoneNumberValidation?.isPhoneNumberValidated || false,
        workpass: workpassValidation?.isWorkpassValidated || false,
        dorm: Boolean(dormValidation),
        adminGranted: Boolean(adminGrantedValidation),
        fin: finValidation?.isFinValidated || false,
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
    let isVerified = true;
    isVerified = isVerified && verificationState.phoneNumber;
    if (!featureService.shouldDisableWorkpassValidation) {
      isVerified = isVerified && verificationState.workpass;
    }
    if (featureService.shouldEnableFinValidation()) {
      isVerified = isVerified && verificationState.fin;
    }
    if (featureService.shouldEnableDormValidation()) {
      isVerified = isVerified && verificationState.dorm;
    }
    return isVerified;
  }

  return {
    getVerificationsForUser,
    isUserVerified,
  };
}

export default UserValidationService;
