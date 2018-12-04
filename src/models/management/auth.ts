export class AuthObject {
    constructor(
        public user_id: string,
        public user_ip: string,
        public timestamp: number,
        public expire_date: number,
        public _id?: string,
        public _rev?: string
    ) { }
}