export class Product {
    name: string;
    description: string;
    category: string;
    sub_category: string;
    producer_id: string;
    brand_id: string;
    channel: MarketingChannel;
    tax_value: number;
    image: string;
    ingredients: Array<any>;
    tags: Array<any>;
    barcode: number;
    timestamp: number;
    status: ProductStatus;
    _id: string;
    _rev: string;
}

export enum MarketingChannel {
    ON_TRADE,
    OFF_TRADE
}

export enum ProductStatus {
    ACTIVE,
    PASSIVE,
    SUSPENDEND
}