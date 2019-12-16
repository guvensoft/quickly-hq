export interface Database {
    host: string,
    port: string,
    username: string,
    password: string,
    codename: string,
    timestamp: number,
    _id?: string,
    _rev?: string,
}

export interface DatabaseU{
    _id: string,
    name: string,
    roles: Array<any>,
    type: string,
    password: string
}

export interface DatabaseSecObject {
    admins: DatabaseAuthObject;
    members: DatabaseAuthObject;
}

export interface DatabaseAuthObject {
    names: Array<any>;
    roles: Array<any>;
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
        this.type = 'user';
        this.roles = [];
    }

    secObject(): DatabaseSecObject | any {
        return {
            admins: {
                names: [],
                roles: []
            },
            members: {
                names: [this.name],
                roles: []
            }
        };
    }
}

