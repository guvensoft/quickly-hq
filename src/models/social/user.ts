export class SocialUser {
    constructor(
        public username: string,
        public password: string,
        public fullname: string,
        public email: string,
        public phone_number: number,
        public avatar: string,
        public type: UserType,
        public timestamp: number,
        public _id?: string,
        public _rev?: string,
    ) { }
}

export interface SocialLinks {
    google: string,
    facebook: string,
    instagram: string,
    twitter: string,
}

export enum UserType {
    SOCIAL_USER,
    STORE_OWNER,
}

export enum Permissions {
    ADD,
    DELETE,
    UPDATE,
}
