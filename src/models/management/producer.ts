export interface Producer {
    name: string,
    description: string,
    account: string,
    logo: string,
    timestamp: number,
    suppliers:Array<string>,
    status: number,
    order: number,
    _id?: string
    _rev?: string
}