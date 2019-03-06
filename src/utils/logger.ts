import { ManagementDB } from '../databases/management';
import { Request } from 'express';

export class Log {
    timestamp: number;
    constructor(
        public req_ip: string,
        public req_headers: any,
        public req_body: any,
        public log_type: LogType,
        public message: any,
        public _id?: string,
        public _rev?: string
    ) {
        this.timestamp = Date.now();
    }
}

export enum LogType {
    CRUD_ERROR,
    INNER_LIBRARY_ERROR,
    AUTH_ERROR,
    DATABASE_ERROR,
    UNVALID_SCHEMA_ERROR
}

export const createLog = (req: Request, type: LogType, reason: any) => {
    let log = new Log(req.ip, req.headers, req.body, type, reason);
    ManagementDB.Logs.post(log).catch(err => { console.log(err) });
}