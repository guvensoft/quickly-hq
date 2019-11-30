export interface Account {
    name: string;
    description: string;
    type: AccountType;
    status: AccountStatus;
    timestamp: number;
    _id?: string;
    _rev?: string;
}

export enum AccountType {
    STORE,
    COMPANY,
    PRODUCER,
    SUPPLIER,
}

export enum AccountStatus {
    ACTIVE,
    PASSIVE,
    SUSPENDEND
}