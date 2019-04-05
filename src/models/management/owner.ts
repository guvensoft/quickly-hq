export class Owner {
    constructor(
        public username: string,
        public password: string,
        public fullname: string,
        public email: string,
        public phone_number: number,
        public avatar: string,
        public account: string,
        public stores: Array<string>,
        public timestamp: number,
        public _id?: string,
        public _rev?: string
    ) { }
}

export enum OwnerType {
    ADMIN,
    MANAGER,
    MODERATOR,
    EMPLOYEE
}

export enum OwnerStatus {
    ACTIVE,
    PASSIVE,
    SUSPENDED
}