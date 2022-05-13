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

export interface OwnerSubscriptions {
    owner: string,
    name:string,
    duration: number,
    type:OwnerSubscriptionType,
    status: OwnerSubscriptionStatus,
    timestamp:number,
    _id?: string,
    _rev?: string,
}


export enum OwnerSubscriptionType {
    MENU,
    POS_MENU,
    POS_MENU_SUPPORT,
    POS_MENU_HQ_SUPPORT,
    DEMO,
    TRIAL,
    FREE,
}

export enum OwnerSubscriptionStatus{
    ACTIVE,
    PASSIVE,
    SUSPENDED
}

export type CreditCardType = 'visa' | 'mastercard' |'amex' | 'discover' | 'dinners' | 'jcb';

export interface CreditCard{
    nameholder:string,
    cardnumber:string,
    month:string,
    year:string,
    cvc:string,
    type: CreditCardType
}

export interface SafeCard{
    owner:string,
    safekey:string,
    type: CreditCardType,
    timestamp:number,
    status:SafeCardStatus,
    _id?: string,
    _rev?: string
}

export enum SafeCardStatus{
    ACTIVE,
    PASSIVE
}
