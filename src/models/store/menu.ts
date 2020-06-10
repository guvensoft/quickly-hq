export interface Menu {
    store_id: string,
    infos: any;
    categories: Array<MenuCategory>;
    promotions: Array<any>;
    status: MenuStatus,
    _id?: string,
    _rev?: string,
}

export interface MenuPromotion {
    name: string,
    description: string,
    image: string
}

export interface MenuCategory {
    name: string;
    description: string;
    image: string;
    items: Array<MenuItem>;
    items_group: Array<MenuItem>;
}

export interface MenuItem {
    product_id: string;
    name: string;
    description: string;
    price: number;
    images: Array<string>;
    options?: Array<{ name: string, price: string }>;
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