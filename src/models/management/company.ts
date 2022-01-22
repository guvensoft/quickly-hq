import { Address } from "./locations";

export interface Company {
    name: string,
    address: Address,
    phone_number: number | string,
    email: string,
    website: string,
    tax_no: string,
    tax_administration: string,
    supervisor: CompanySupervisor
    timestamp: number,
    type:CompanyType,
    status:CompanyStatus,
    _id?: string,
    _rev?: string,
}

export interface CompanySupervisor{
    username:string,
    password:string
}

export enum CompanyType {
    ANONYMOUS,
    LIMITED,
    COMANDITE,
    COLLECTIVE,
    COOPERATIVE,
}

export enum CompanyStatus {
    ACTIVE,
    PASSIVE,
    SUSPENDED
}