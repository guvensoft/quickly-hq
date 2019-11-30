export interface User {
    username: string,
    password: string,
    fullname: string,
    email: string,
    phone_number: number,
    avatar: string,
    group: string,
    timestamp: number,
    _id?: string,
    _rev?: string
}

export interface Group {
    name: string,
    description: string,
    canRead: boolean,
    canWrite: boolean,
    canEdit: boolean,
    canDelete: boolean,
    timestamp: number,
    _id?: string,
    _rev?: string
}