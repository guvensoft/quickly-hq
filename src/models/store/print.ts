import { Printer } from './settings';

export type PrintOutType = 'Check' | 'Order' | 'QRCode' | 'Order' | 'Receipt' | 'Report';

export interface PrintOut {
    type: PrintOutType,
    status: PrintOutStatus,
    connection: string,
    printer: Printer,
    db_name:'prints',
    db_seq:0
    _id?:string,
    _rev:string
}

export enum PrintOutStatus {
    WAITING,
    PRINTED,
    ERROR
}