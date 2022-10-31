import type { DormValidation as DormValidationEntity } from '../models';
import type { Dorm as DormService } from '.';

function DormValidationService(
  DormValidationModel: typeof DormValidationEntity,
  dormService: typeof DormService
) {
  async function validateDormValidation(
    dormValidation: Partial<DormValidationEntity>
  ) {
    if (!dormValidation.dormId) {
      return;
    }
    const existingDorm = await dormService.getDorm(dormValidation.dormId);
    if (!existingDorm) {
      throw new Error('Validation Error: Dorm does not exist');
    }
  }

  async function upsertDormValidation(
    userId: number,
    dormValidation: Partial<DormValidationEntity>
  ) {
    return DormValidationModel.upsert({
      ...dormValidation,
      userId,
    });
  }

  async function getDormValidationForUser(userId: number) {
    return DormValidationModel.findOne({
      where: {
        userId,
      },
    });
  }

  async function deleteDormValidationByUserId(userId: number) {
    const dormValidation = await getDormValidationForUser(userId);
    return dormValidation?.destroy();
  }

  async function validateUser(
    userId: number,
    dormId: number | null | undefined = null
  ) {
    const newDormValidation = {
      dormId,
    };
    await validateDormValidation(newDormValidation);
    return upsertDormValidation(userId, newDormValidation);
  }

  async function invalidateUser(userId: number) {
    await deleteDormValidationByUserId(userId);
  }

  return {
    validateUser,
    invalidateUser,
    getDormValidationForUser,
  };
}

export { DormValidationService };
export default DormValidationService;
