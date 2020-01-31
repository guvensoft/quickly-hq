export interface Producer {
    name: string,
    description: string,
    account: string,
    logo: string,
    timestamp: number,
    status: number,
    order: number,
    _id?: string
    _rev?: string
}