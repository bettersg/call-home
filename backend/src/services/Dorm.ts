import { sanitizeDbErrors } from './lib';
import type { Dorm as DormEntity } from '../models';

// Open questions:
// - How do we report dorm-user relationships if the dorm is deleted?
// - How do we recover data if the dorm is updated beyond recognition?
function DormService(DormModel: typeof DormEntity) {
  async function createDorm({ name }: Pick<DormEntity, 'name'>) {
    return sanitizeDbErrors(() =>
      DormModel.create({
        name,
      })
    );
  }

  async function getDorms() {
    return DormModel.findAll();
  }

  async function getDorm(dormId: number) {
    return DormModel.findOne({
      where: {
        id: dormId,
      },
    });
  }

  async function updateDorm(dormId: number, dorm: Partial<DormEntity>) {
    await DormModel.update(dorm, {
      where: {
        id: dormId,
      },
    });

    return getDorm(dormId);
  }

  async function deleteDorm(dormId: number) {
    const dorm = await getDorm(dormId);
    if (!dorm) {
      return;
    }
    await dorm.destroy();
  }

  return {
    createDorm,
    getDorms,
    deleteDorm,
    updateDorm,
  };
}

export default DormService;
