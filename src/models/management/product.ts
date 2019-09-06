export class Product {
    name: string;
    description: string;
    category: string;
    sub_category: string;
    unit: string;
    portion: number;
    production_date: number;
    expiration_date: number;
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