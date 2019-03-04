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

export class DatabaseUser {
    public _id: string;
    public name: string;
    public roles: Array<any>;
    public type: string;
    public password: string;
    constructor(username: string, passphrase: string) {
        this._id = "org.couchdb.user:" + username;
        this.name = username;
        this.password = passphrase;
        this.type = 'user',
        this.roles = []
    }
}

export interface DatabaseSecObject {
    admins: DatabaseAuthObject;
    members: DatabaseAuthObject;
}

export interface DatabaseAuthObject {
    names: Array<any>;
    roles: Array<any>;
}