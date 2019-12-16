export interface Owner {
    username: string,
    password: string,
    fullname: string,
    email: string,
    phone_number: number,
    avatar: string,
    account: string,
    stores: Array<string>,
    timestamp: number,
    _id?: string,
    _rev?: string,
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