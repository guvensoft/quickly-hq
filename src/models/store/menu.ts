export interface Menu {
    slug: string,
    store_id: string
    categories: Array<MenuCategory>;
    promotions: Array<MenuPromotion>;
    social_links: MenuSocialLinks;
    theme: MenuTheme;
    status: MenuStatus;
    _id?: string;
    _rev?: string;
}

export interface MenuSocialLinks {
    name: string;
    href: string;
    type: 'instagram' | 'facebook' | 'twitter' | 'reddit' | 'google';
}

export interface MenuTheme {
    brand: string;
    greetings: string,
    fonts: string,
    segment: string,
    buttons: string,
    background: string
}

export interface MenuPromotion {
    name: string,
    description: string,
    image: string,
    connection: string,
}

export interface MenuCategory {
    id: string;
    name: string;
    description: string;
    image: string;
    items: Array<MenuItem>;
    items_group: Array<MenuSubCategory>;
}

export interface MenuSubCategory {
    id: string;
    name: string;
    description: string;
    items: Array<MenuItem>;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    is_hidden: boolean;
    product_id: string;
    options?: Array<{ name: string, price: number }>;
}

export interface MenuStore {
    name: string;
    image: string;
    wifi: { ssid: string, password: string };
}

export enum MenuStatus {
    ACTIVE,
    PASSIVE,
    SUSPENDED
}

export interface User {
    id: string,
    name: string,
    phone?: string,
    address?: string,
}


export interface Check {

}

export interface OrderItem {
    product_id: string;
    name: string;
    price: number;
    note: string;
    type?: string;
}

export interface Order {
    db_name: string,
    user: User,
    items: Array<OrderItem>,
    status: OrderStatus,
    type: OrderType,
    timestamp: number,
    _id?: string;
    _rev?: string;
}

export enum OrderType {
    INSIDE,
    OUTSIDE,
    TAKEAWAY
}

export enum OrderStatus {
    WAITING,
    PREPARING,
    APPROVED,
    CANCELED,
    PAYED
}

export interface Receipt {
    db_name: string,
    user: User,
    check: Check,
    orders: Array<Order>,
    total: number,
    discount: number,
    type: ReceiptType,
    method:ReceiptMethod,
    status: ReceiptStatus,
    timestamp: number, 
    _id?: string;
    _rev?: string;
}

export enum ReceiptMethod {
    CASH,
    CARD,
    COUPON,
    MOBILE,
    CRYPTO,
}

export enum ReceiptType {
    ALL,
    USER,
    PARTIAL
}

export enum ReceiptStatus {
    REQUESTED,
    WAITING,
    READY,
    APPROVED,
    CANCELED
}
