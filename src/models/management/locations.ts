export interface Cordinates {
    latitude: number,
    longitude: number
}

export interface Address {
    country: string,
    state: string,
    province: string,
    district: string,
    street: string,
    description: string,
    cordinates: Cordinates
}

export enum LocationType {
    RESTAURANT,
    SHOP,
    MARKET,
    USER,
    EVENT
}