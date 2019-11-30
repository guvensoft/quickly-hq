export interface Brand {
    name: string;
    description: string;
    logo: string;
    producer_id: string;
    status: BrandStatus;
    timestamp:number;
}

export enum BrandStatus {
    ACTIVE,
    PASSIVE,
    SUSPENDEND
}