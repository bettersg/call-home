import { sanitizeDbErrors } from './lib';
import type {
  RedeemableCode as RedeemableCodeEntity,
  RedeemableCodeType,
} from '../models';

const DEFAULT_SEGMENT_LENGTH = 4;
const DEFAULT_SEGMENT_COUNT = 3;
const DEFAULT_SEPARATOR = '-';
const DEFAULT_CHARACTER_SET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateCodeString(
  characterSet: string = DEFAULT_CHARACTER_SET,
  segmentLength: number = DEFAULT_SEGMENT_LENGTH,
  segmentCount: number = DEFAULT_SEGMENT_COUNT,
  separator: string = DEFAULT_SEPARATOR
): string {
  const pickCharacter = () => {
    const index = Math.floor(Math.random() * characterSet.length);
    return characterSet[index];
  };
  const genSegment = () => {
    const segmentArray: string[] = [];
    for (let i = 0; i < segmentLength; i += 1) {
      segmentArray.push(pickCharacter());
    }
    return segmentArray.join('');
  };
  const codeArray: string[] = [];
  for (let i = 0; i < segmentCount; i += 1) {
    codeArray.push(genSegment());
  }
  return codeArray.join(separator);
}

function RedeemableCodeService(
  RedeemableCodeModel: typeof RedeemableCodeEntity
) {
  async function createRedeemableCode(
    redeemableCode: Pick<
      RedeemableCodeEntity,
      'codeType' | 'code' | 'redemptionLimit'
    >
  ) {
    return sanitizeDbErrors(() => RedeemableCodeModel.create(redeemableCode));
  }

  async function generateRedeemableCode({
    codeType,
    redemptionLimit,
  }: {
    codeType: RedeemableCodeType;
    redemptionLimit: number | null;
  }) {
    return createRedeemableCode({
      codeType,
      redemptionLimit,
      code: generateCodeString(),
    });
  }

  async function getRedeemableCodes() {
    return RedeemableCodeModel.findAll();
  }

  async function getRedeemableCode(
    redeemableCodeId: number
  ): Promise<RedeemableCodeEntity | null> {
    return RedeemableCodeModel.findOne({
      where: {
        id: redeemableCodeId,
      },
    });
  }

  async function getRedeemableCodeByCode(
    code: string
  ): Promise<RedeemableCodeEntity | null> {
    return RedeemableCodeModel.findOne({
      where: {
        code,
      },
    });
  }

  async function updateRedeemableCode(
    redeemableCodeId: number,
    redeemableCode: Partial<RedeemableCodeEntity>
  ) {
    await RedeemableCodeModel.update(redeemableCode, {
      where: {
        id: redeemableCodeId,
      },
    });

    return getRedeemableCode(redeemableCodeId);
  }

  async function deleteRedeemableCode(redeemableCodeId: number) {
    const redeemableCode = await getRedeemableCode(redeemableCodeId);
    if (!redeemableCode) {
      return;
    }
    await redeemableCode.destroy();
  }

  return {
    getRedeemableCode,
    getRedeemableCodeByCode,
    getRedeemableCodes,
    deleteRedeemableCode,
    updateRedeemableCode,
    generateRedeemableCode,
  };
}

export default RedeemableCodeService;
