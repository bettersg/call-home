// The type of transactions allowed
export type TransactionReference =
  | 'call'
  | 'periodic-credit'
  | 'admin'
  | 'redeemable-code-fb';

export interface TransactionResponse {
  userId: number;
  reference: TransactionReference;
  amount: number;
}
