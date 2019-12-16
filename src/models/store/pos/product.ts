export interface Category {
    name: string,
    description: string,
    status: number,
    printer: string,
    order: number,
    tags: string,
    _id?: string,
    _rev?: string
}
export interface SubCategory {
    cat_id: string,
    name: string,
    description: string,
    status: number,
    _id?: string,
    _rev?: string
}
export interface Occations {
    name: string,
    price_list: Array<OccationUnit>
}
export interface OccationUnit {
    product_id: string,
    price: number,
}
export interface Product {
    cat_id: string,
    type: number,
    description: string,
    name: string,
    price: number,
    status: number,
    tax_value: number,
    barcode: number,
    subcat_id?: string,
    specifies?: Array<ProductSpecs>,
    _id?: string,
    _rev?: string
}
export interface ProductGroup {
    cat_id: string,
    name: string,
    description: string,
    price: number,
    products: Array<Product>,
    status: number,
    subcat_id?: string,
    specifies?: Array<ProductSpecs>,
    _id?: string,
    _rev?: string
}
export interface ProductSpecs {
    spec_name: string,
    spec_price: number
}
export interface Recipe {
    product_id: string,
    recipe: Array<Ingredient>,
    _id?: string,
    _rev?: string
}
export interface Ingredient {
    stock_id: string,
    amount: number
}

export enum ProductType {
    PASSIVE,
    AUTOMATIC,
    MANUEL
}

export enum ProductStatus{
    PASSIVE,
    ACTIVE,
    LOCKED,
    CANCELED
}