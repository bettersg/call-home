export type TransactionReference = 'call' | 'periodic-credit' | 'admin';

export interface TransactionResponse {
  userId: number;
  reference: TransactionReference;
  amount: number;
}
