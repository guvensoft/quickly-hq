export interface Table {
    name: string,
    capacity: number,
    status: TableStatus,
    store_id: string,
    floor_id: string,
    _id?: string,
    _rev?: string,
}

export enum TableStatus {
    PASSIVE,
    ACTIVE,
    OCCUPIED,
    WILL_READY
}