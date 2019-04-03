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
        public auth: StoreAuth,
        public accounts: Array<string>,
        public settings: StoreSettings,
        public status: StoreStatus,
        public timestamp: number,
        public _id?: string,
        public _rev?: string
    ) { }
}

export interface StoreAuth {
    database_id: string,
    database_name: string,
    database_user: string,
    database_password: string,
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
    days: Array<StoreDaysStatus>,
    wifi: Array<StoreWifiSettings>,
    others: Array<string>
}

export interface StoreDaysStatus {
    is_open: boolean;
    opening: string
    closing: string;
}

export interface StoreWifiSettings {
    ssid: string;
    password: string;
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