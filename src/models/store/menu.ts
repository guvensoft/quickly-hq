
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