import { UnitType } from "../store/stocks";

export interface Product {
    name: string,
    description: string,
    category: string,
    sub_category: string,
    unit: UnitType,
    portion: number,
    packages: Array<ProductPackage>,
    producer_id: string,
    brand_id: string,
    channel: MarketingChannel,
    tax_value: number,
    image: string,
    ingredients: Array<any>,
    tags: Array<any>,
    barcode: number,
    sku: string,
    type: ProductType,
    status: ProductStatus,
    order: number,
    timestamp: number,
    _id?: string,
    _rev?: string
}

export interface ProductPackage {
    name: string,
    quantity: number,
}

export enum ProductType {
    RAW,
    PRODUCT,
    BOTH
}

export enum ProductStatus {
    ACTIVE,
    PASSIVE,
    SUSPENDEND
}

export enum MarketingChannel {
    ON_TRADE,
    OFF_TRADE,
    BOTH_TRADE
}