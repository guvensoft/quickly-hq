export interface SocialUser {
    username: string,
    password: string,
    fullname: string,
    email: string,
    phone_number: number,
    avatar: string,
    type: UserType,
    timestamp: number,
    _id?: string,
    _rev?: string,
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
