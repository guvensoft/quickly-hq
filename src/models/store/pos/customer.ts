export interface Customer {
    name: string,
    surname: string,
    phone_number: number,
    address: string,
    picture: string,
    type: CustomerType,
    timestamp: number,
    _id?: string,
    _rev?: string
}

export interface CustomerAccount {
    customer_id: string,
    points: number,
    limit: number,
    _id?: string,
    _rev?: string
}

export enum CustomerType {
    NEAR,
    FAR
}
