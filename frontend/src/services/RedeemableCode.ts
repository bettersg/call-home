import { RedeemableCode } from '@call-home/shared/types/RedeemableCode';

import apiClient from './apiClient';
import ObservableService from './observableService';

const facebookRedeemableCodeEndpoint = '/promo-codes/facebook-dorm';

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

  async createRedeemableCode(): Promise<RedeemableCode> {
    const newRedeemableCode = (await apiClient.post(
      facebookRedeemableCodeEndpoint
    )) as RedeemableCode;
    this.refreshRedeemableCodes();
    return newRedeemableCode;
  }

  // async deleteRedeemableCode(dormId: number): Promise<void> {
  //   await apiClient.delete(`${facebookRedeemableCodeEndpoint}/${dormId}`);
  //   this.refreshRedeemableCodes();
  // }
}
