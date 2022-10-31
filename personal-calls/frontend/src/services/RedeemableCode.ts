import { RedeemableCode } from '@call-home/shared/types/RedeemableCode';

import apiClient from './apiClient';
import ObservableService from './observableService';

const facebookRedeemableCodeEndpoint = '/promo-codes/facebook-dorm';
// const cckRedeemableCodeEndpoint = '/promo-codes/cck-dorm';

export interface RedeemableCodeState {
  codes: RedeemableCode[];
}

export default class RedeemableCodeService extends ObservableService<RedeemableCodeState> {
  constructor() {
    super();
    this.state = {
      codes: [],
    };
  }

  async refreshRedeemableCodes(): Promise<RedeemableCode[]> {
    const codes = (await apiClient.get(
      facebookRedeemableCodeEndpoint
    )) as RedeemableCode[];
    this.state = {
      ...this.state,
      codes,
    };
    this.notify();
    return codes;
  }

  async createFacebookRedeemableCode(): Promise<RedeemableCode> {
    const newRedeemableCode = (await apiClient.post(
      facebookRedeemableCodeEndpoint
    )) as RedeemableCode;
    this.refreshRedeemableCodes();
    return newRedeemableCode;
  }

  // eslint-disable-next-line class-methods-use-this
  async redeemCode(code: string): Promise<void> {
    return apiClient.post(`${facebookRedeemableCodeEndpoint}/redemptions`, {
      code,
    });
  }

  async deleteRedeemableCode(codeId: number): Promise<void> {
    await apiClient.delete(`${facebookRedeemableCodeEndpoint}/codes/${codeId}`);
    this.refreshRedeemableCodes();
  }
}
