export interface Check {
    table_id: string;
    total_price: number;
    discount: number;
    owner: string;
    note: string;
    status: CheckStatus;
    products: Array<CheckProduct>;
    timestamp: number;
    type: CheckType;
    check_no: number;
    payment_flow?: Array<PaymentStatus>;
    discountPercent?: number;
    occupation?: Occupation;
    _id?: string;
    _rev?: string
}

export interface ClosedCheck {
    table_id: string;
    total_price: number;
    discount: number;
    owner: string;
    note: string;
    status: CheckStatus;
    products: Array<CheckProduct>;
    timestamp: number;
    type: CheckType;
    payment_method: string;
    payment_flow?: Array<PaymentStatus>;
    description?: string;
    occupation?: Occupation;
    _id?: string;
    _rev?: string;
}

export interface PaymentStatus {
    owner: string;
    method: 'Nakit' | 'Kart' | 'Kupon' | 'İkram';
    amount: number;
    discount: number;
    timestamp: number;
    payed_products: Array<CheckProduct>
}

export interface Occupation { male: number, female: number };

export interface CheckProduct {
    id: string;
    cat_id: string;
    name: string;
    price: number;
    note: string;
    status: number;
    owner: string;
    timestamp: number;
    tax_value: number;
    barcode: number;
}

export enum CheckType {
    PASSIVE,
    NORMAL,
    FAST,
    CANCELED,
    PROCESSING,
    ORDER,
    PREORDER,
    SELF
}

export enum CheckStatus {
    PASSIVE,
    READY,
    OCCUPIED,
    PROCESSING,
}

export function CheckNo() {
    let CheckNo = Math.floor(Math.random() * Math.floor(500));
    return CheckNo;
}