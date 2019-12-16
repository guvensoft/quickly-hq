export interface Cashbox {
    type: string;
    description: string;
    timestamp: number;
    cash: number;
    card: number;
    coupon: number;
    user: string;
    _id?: string;
    _rev?: string
}

export enum CashboxType {
  PASSIVE,
  INCOME,
  OUTCOME
}