export interface Category {
    name: string,
    description: string,
    image: string,
    type: CategoryType,
    timestamp: number,
    status: number,
    _id: string,
    _rev: string
}

export interface SubCategory {
    category_id: string,
    name: string,
    description: string,
    image: string,
    timestamp: number,
    status: number,
    _id: string,
    _rev: string
}

export enum CategoryType {
    FOOD,
    BEVERAGE,
    DEVICE,
    OTHER,
}