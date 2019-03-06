export interface ILocation {
    connection_id: string,
    connection_type: LocationType,
    cordinates: ICordinates,
    _id?: string,
    _rev?: string
}

export interface ICountry {
    name: string,
    currency: string,
    description: string,
    cordinates: ICordinates,
    polygon?: Array<any>,
    _id?: string,
    _rev?: string
}

export interface IState {
    name: string,
    country_id: string,
    description: string,
    cordinates: ICordinates,
    polygon?: Array<any>,
    _id?: string,
    _rev?: string
}

export interface ICity {
    name: string,
    state_id: string,
    description: string,
    cordinates: ICordinates,
    polygon?: Array<any>,
    _id?: string,
    _rev?: string
}

export interface IProvince {
    name: string,
    city_id: string,
    description: string,
    cordinates: ICordinates,
    polygon?: Array<any>,
    _id?: string,
    _rev?: string
}

export interface ICordinates {
    latitude: number,
    longitude: number
}

export interface IAddress {
    country: string,
    state: string,
    city: string,
    province: string,
    description: string,
    cordinates: ICordinates
}

export enum LocationType {
    RESTAURANT,
    SHOP,
    MARKET,
    USER,
    EVENT
}