import { Company } from "./company";

export type Currency = 'USD' | 'TRY' | 'EUR';
export type InstallmentOptions = 1 | 2 | 4 | 6;

export interface CurrencyRate {
    currency: Currency,
    rate: number
}

export interface Invoice {
    from: Company,
    to: Company,
    items: Array<InvoiceItem>,
    total: number,
    sub_total: number,
    tax_total: number,
    installment: InstallmentOptions,
    currency_rates: Array<CurrencyRate>,
    status: InvoiceStatus,
    type: InvoiceType,
    timestamp: number,
    expiry: number,
    _id?: string,
    _rev?: string
}

export interface InvoiceItem {
    name: string,
    description: string,
    price: number,
    quantity: number,
    tax_value: number,
    discount: number,
    currency: Currency,
    total_tax:number,
    total_price:number,
}

export enum InvoiceStatus {
    WAITING,
    APPROVED,
    PAYED,
    CANCELED,
}

export enum InvoiceType {
    OPEN,
    CLOSED,
    EXPIRED
}