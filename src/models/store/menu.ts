export interface Menu {
    restaurant: MenuStore;
    lastMenuXmlFileName: string;
    categories: Array<MenuCategory>;
    promotions: Array<any>;
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
    price?: number;
    options: Array<{ name: string, price: string }>
}

export interface MenuStore {
    name: string;
    image: string;
    wifi: { ssid: string, password: string };
    music: { current: "Bonobo -  Kerala", next: "Aleyna Tilki - HAHAHA" }
}