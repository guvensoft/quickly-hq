export class Table {
    constructor(
        public name: string,
        public capacity: number,
        public status: TableStatus,
        public store_id: string,
        public floor_id: string,
        public _id?: string,
        public _rev?: string,
    ) { }
}

export enum TableStatus {
    PASSIVE,
    ACTIVE,
    OCCUPIED,
    WILL_READY
}