export interface Customer {
    name: string;
    surname: string;
    phone_number: string;
    picture: string;
    address: string;
    _id?: string;
    _rev?: string
}

export interface Account {
    customer_id:string;
    points:number;
    limit: number;
    _id?: string;
    _rev?: string
}

