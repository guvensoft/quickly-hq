export interface Settings {
    key: string,
    value: any,
    description: string,
    timestamp: number,
}
export interface AuthInfo {
    app_remote: string,
    app_port: string,
    app_db: string,
    app_id: string,
    app_token: string,
}
export interface ServerInfo {
    type: number,
    status: number,
    ip_address: string,
    ip_port: number,
    key: string
}
export interface Printer {
    name: string,
    type: string,
    note: string,
    device_port: number,
}
export interface PaymentMethod {
    name: string,
    description: string,
    color: string,
    icon: string,
    type: number,
    status: number
}
export interface DayInfo {
    day: number,
    started: boolean,
    time: number,
}