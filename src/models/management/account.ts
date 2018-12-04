export class Account {
    constructor(
        public username: string,
        public password: string,
        public fullname: string,
        public email: string,
        public phone_number: number,
        public timestamp: number,
        public avatar: string,
        public status: AccountStatus,
        public _id?: string,
        public _rev?: string
    ) { }
}

export enum AccountStatus {
    ACTIVE,
    PASSIVE,
    SUSPENDEND
}