export interface Session {
    user_id: string,
    user_ip: string,
    timestamp: number,
    expire_date: number,
    _id?: string,
    _rev?: string
}