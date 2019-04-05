export class User {
    constructor(
        public username: string,
        public password: string,
        public fullname: string,
        public email: string,
        public phone_number: number,
        public avatar: string,
        public group: string,
        public timestamp: number,
        public _id?: string,
        public _rev?: string
    ) { }
}

export class Group {
    constructor(
        public name: string,
        public description: string,
        public canRead: boolean,
        public canWrite: boolean,
        public canEdit: boolean,
        public canDelete: boolean,
        public timestamp: number,
        public _id?: string,
        public _rev?: string
    ) { }
}