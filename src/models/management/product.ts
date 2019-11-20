export class Product {
    name: string;
    description: string;
    category: string;
    sub_category: string;
    unit: string;
    portion: number;
    producer_id: string;
    tax_value: number;
    image: string;
    ingredients: Array<any>;
    tags: Array<any>;
    calorie: number;
    barcode: number;
    timestamp: number;
    _id: string;
    _rev: string;
}

export class Category {
    name: string;
    description: string;
    image: string;
    type: CategoryType;
    timestamp: string;
    _id: string;
    _rev: string;
}

export class SubCategory {
    category_id: string;
    name: string;
    description: string;
    image: string;
    timestamp: string;
    _id: string;
    _rev: string;
}

export enum CategoryType {
    FOOD,
    BEVERAGE,
    DEVICE,
    OTHER,
}