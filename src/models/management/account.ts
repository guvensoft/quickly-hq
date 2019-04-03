export class Account {
    constructor(
        public name: string,
        public description: string,
        public type: AccountType,
        public status: AccountStatus,
        public timestamp: number,
        public _id?: string,
        public _rev?: string
    ) { }
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