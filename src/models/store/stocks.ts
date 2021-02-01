export interface Stock {
    name: string,
    description: string,
    cat_id: string,
    quantity: number,
    unit: UnitType,
    total: number,
    left_total: number,
    first_quantity: number,
    warning_limit: number,
    warning_value: number,
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
