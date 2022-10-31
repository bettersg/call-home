export enum RedeemableCodeType {
  FACEBOOK_DORM = 'FACEBOOK_DORM',
}

export interface RedeemableCode {
  id: number;
  code: string;
  codeType: RedeemableCodeType;
  redemptionLimit: number | null;
  createdAt: string;
}
