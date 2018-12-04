export class PaymentMethod {
    constructor(
        public name: string,
        public type: PaymentType,
        public description: string,
        public _id?: string,
        public _rev?: string
    ) { }
}

export enum PaymentType {
    CASH,
    CARD,
    COUPON,
    CRYPTO
}