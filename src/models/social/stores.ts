import { Category, Cuisine } from './categories';
import { PaymentMethod } from './payments';
import { IAddress } from './locations';

export class Store {
    constructor(
        public name: string,
        public type: StoreType,
        public category: Category | Array<Category>,
        public cuisine: Cuisine | Array<Cuisine>,
        public address: IAddress,
        public email: string | Array<string>,
        public phone_number: string | Array<string>,
        public motto: string,
        public description: string,
        public logo: string,
        public settings: StoreSettings,
        public status: StoreStatus,
        public _id?: string,
        public _rev?: string
    ) { }
}

export interface StoreSettings {
    order: boolean,
    preorder: boolean,
    reservation: boolean,
    accesibilty: StoreAccesibilty,
    allowed_tables: boolean,
    allowed_products: boolean,
    allowed_payments: Array<PaymentMethod>
}

export interface StoreAccesibilty {
    days: [boolean, boolean, boolean, boolean, boolean, boolean],
    hours: [[string, string], [string, string], [string, string], [string, string], [string, string], [string, string]],
    wifi: [boolean, string],
    others: Array<string>
}

export enum StoreStatus {
    ACTIVE,
    PASSIVE,
    SUSPENDED,
    DELETED,
}

export enum StoreType {
    RESTAURANT,
    SHOP,
    MARKET
}