import { Product } from "../../management/product";

export class Stock {
    constructor(
        public name: string,
        public description: string,
        public cat_id: string,
        public quantity: number,
        public unit: string,
        public total: number,
        public left_total: number,
        public first_quantity: number,
        public warning_limit: number,
        public warning_value: number,
        public timestamp: number,
        public _id?: string,
        public _rev?: string
    ) { }
}
export class StockCategory {
    constructor(
        public name: string,
        public description: string,
        public _id?: string,
        public _rev?: string
    ) { }
}

export type UnitType = 'Gr' | 'Kg' | 'Ml' | 'Cl' | 'Lt';


export class StockTransfer {
    name: string;
    description: string;
    unit: string;
    portion: number;
    quantity: number;
    first_quantity: number;
    total: number;
    first_total: number;
    warning_limit: number;
    warning_value: number;
    category: string;
    sub_category: string;
    producer: string;
    product: string;
    warehouse: string;
    timestamp: number;
    _id?: string;
    _rev?: string;

    constructor(product: Product, quantity: number, warning?: number, warehouse?: string) {
        this.name = product.name;
        this.description = product.description;
        this.unit = product.unit;
        this.portion = product.portion;
        this.quantity = quantity;
        this.first_quantity = quantity;
        this.total = product.portion * quantity;
        this.first_total = product.portion * quantity;
        this.warning_value = (warning ? warning : 25);
        this.warning_limit = (this.total * this.quantity) * this.warning_value / 100;
        this.category = product.category;
        this.sub_category = product.sub_category;
        this.producer = product.producer_id;
        this.product = product._id;
        this.warehouse = (warehouse ? warehouse : '');
        this.timestamp = Date.now();
    }
}