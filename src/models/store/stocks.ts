export interface Stock {
    name: string,
    description: string,
    unit: UnitType,
    portion: number,
    quantity: number,
    first_quantity: number,
    total: number,
    left_total: number,
    first_total: number,
    warning_value: number,
    warning_limit: number,
    category: string,
    sub_category: string,
    producer: string,
    product: string,
    warehouse: string,
    supplier: string,
    timestamp: number,
    _id?: string,
    _rev?: string
}

export interface StockCategory {
    name: string,
    description: string,
    _id?: string,
    _rev?: string
}

export type UnitType = 'Gr' | 'Kg' | 'Ml' | 'Cl' | 'Lt';
