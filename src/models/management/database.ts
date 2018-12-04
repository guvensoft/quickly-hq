export class Database {
    constructor(
        public host: string,
        public port: string,
        public username: string,
        public password: string,
        public codename: string,
        public timestamp: number,
        public _id?: string,
        public _rev?: string
    ) { }
}