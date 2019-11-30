import { Address } from './locations'

export interface Supplier {
    logo: string;
    name: string;
    description: string;
    address: Address;
    phone_number: number;
    email: string;
    tax_no: number;
    account_id: string;
    products: Array<string>;
    status: number;
    timestamp: number
}