export class User {
    constructor(
        public username: string,
        public password: string,
        public fullname: string,
        public email: string,
        public phone_number: number,
        public timestamp: number,
        public avatar: string,
        public group: string,
        public _id?: string,
        public _rev?: string
    ) { }
}

export class UserGroup {
    constructor(
        public name: string,
        public description: string,
        public timestamp: number,
        public canRead: boolean,
        public canWrite: boolean,
        public canEdit: boolean,
        public canDelete: boolean,
        public _id?: string,
        public _rev?: string
    ) { }
}