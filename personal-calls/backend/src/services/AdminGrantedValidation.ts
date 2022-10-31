import type { AdminGrantedValidation as AdminGrantedValidationEntity } from '../models';

interface AdminGrantedValidationService {
  getAdminGrantedValidationForUser: (
    userId: number
  ) => Promise<AdminGrantedValidationEntity | null>;
  invalidateUser: (userId: number) => Promise<unknown>;
  validateUser: ({
    grantingUserId,
    userId,
  }: {
    grantingUserId: number;
    userId: number;
  }) => Promise<AdminGrantedValidationEntity>;
}

function AdminGrantedValidationService(
  AdminGrantedValidationModel: typeof AdminGrantedValidationEntity
): AdminGrantedValidationService {
  async function createAdminGrantedValidationForUser({
    grantingUserId,
    userId,
  }: {
    grantingUserId: number;
    userId: number;
  }) {
    const currentValidationState = await AdminGrantedValidationModel.findOne({
      where: {
        userId,
      },
    });
    if (currentValidationState) {
      return currentValidationState;
    }
    return AdminGrantedValidationModel.create({
      userId,
      grantedByUserId: grantingUserId,
    });
  }

  async function getAdminGrantedValidationForUser(userId: number) {
    return AdminGrantedValidationModel.findOne({
      where: {
        userId,
      },
    });
  }

  async function deleteAdminGrantedValidationForUser(userId: number) {
    return AdminGrantedValidationModel.destroy({
      where: { userId },
    });
  }

  // Define a simple pair of functions that will validate/invalidate a user
  async function invalidateUser(userId: number) {
    return deleteAdminGrantedValidationForUser(userId);
  }

  async function validateUser({
    grantingUserId,
    userId,
  }: {
    grantingUserId: number;
    userId: number;
  }) {
    return createAdminGrantedValidationForUser({ grantingUserId, userId });
  }

  return {
    getAdminGrantedValidationForUser,
    invalidateUser,
    validateUser,
  };
}

export { AdminGrantedValidationService };
export default AdminGrantedValidationService;
