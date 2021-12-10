export interface Campaign {
    name: string,
    description: string,
    image: string,
    producer: string,
    connection:string,
    status: CampaignStatus,
    timestamp: number,
    _id: string,
    _rev: string
}

export enum CampaignStatus {
    ACTIVE,
    PASSIVE,
    SUSPENDEND
}