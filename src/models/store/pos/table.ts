export interface Table {
    name: string,
    floor_id: string,
    capacity: number,
    description: string,
    status: number,
    timestamp: number,
    customers: Array<string>,
    _id?: string,
    _rev?: string
}
export interface Floor {
    name: string,
    description: string,
    status: number,
    timestamp: number,
    special: number,
    conditions: FloorSpecs,
    _id?: string,
    _rev?: string
}
export interface FloorSpecs {
    air: boolean,
    cigarate: boolean,
    reservation: boolean,
    music: boolean,
    events: boolean,
}

export enum TableStatus{
    PASSIVE,
    ACTIVE,
    OCCUPIED,
    WILL_READY
}