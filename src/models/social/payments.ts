export interface PaymentMethod {
    name: string,
    type: PaymentType,
    description: string,
    _id?: string,
    _rev?: string
}

export enum PaymentType {
    CASH,
    CARD,
    COUPON,
    CRYPTO
}