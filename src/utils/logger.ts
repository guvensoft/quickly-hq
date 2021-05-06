import { ManagementDB } from '../configrations/database';
import { Request } from 'express';

export interface Log {
    req_ip: string;
    req_headers: any;
    req_body: any;
    log_type: LogType;
    message: any;
    timestamp: number;
    _id?: string,
    _rev?: string
}

export enum LogType {
    CRUD_ERROR,
    INNER_LIBRARY_ERROR,
    AUTH_ERROR,
    DATABASE_ERROR,
    UNVALID_SCHEMA_ERROR
}

export const createLog = (req: Request, type: LogType, message: any) => {
    console.log(message);
    let log: Log = { req_ip: req.ip, req_headers: req.headers, req_body: req.body, log_type: type, message: message, timestamp: Date.now() };
    ManagementDB.Logs.post(log).catch(err => { console.log(err) });
}