import { Address } from './locations';

export interface Store {
    name: string,
    slug:string,
    motto: string,
    description: string,
    notes:string,
    logo: string,
    supervisory:string
    address: Address,
    email: string | Array<string>,
    phone_number: string | Array<string>,
    auth: StoreAuth,
    accounts: Array<string>,
    company:string,
    settings: StoreSettings,
    category: StoreCategory | Array<StoreCategory>,
    cuisine: StoreCuisine | Array<StoreCuisine>,
    type: StoreType,
    status: StoreStatus,
    timestamp: number,
    _id?: string,
    _rev?: string
}

export interface StoreAuth {
    database_id: string,
    database_name: string,
    database_user: string,
    database_password: string,
}

export interface StoreSettings {
    order: boolean,
    preorder: boolean,
    reservation: boolean,
    accesibilty: StoreAccesibilty,
    allowed_tables: boolean,
    allowed_products: boolean,
    allowed_payments: Array<string>
}

export interface StoreAccesibilty {
    days: Array<StoreDaysStatus>,
    wifi: StoreWifiSettings,
    others: Array<string>
}

export interface StoreDaysStatus {
    is_open: boolean,
    opening: string,
    closing: string
}

export interface StoreWifiSettings {
    ssid: string,
    password: string
}

export enum StoreStatus {
    ACTIVE,
    PASSIVE,
    SUSPENDED,
    DELETED,
}

export enum StoreType {
    RESTAURANT,
    MARKET,
    SHOP
}

export enum StoreCategory {
    PUB,
    BISTRO,
    COFFEESHOP,
    APPERTIZERS,
    PIZZA,
    SEAFOOD,
    SOUP,
    SALAD,
    PASTA,
    DESERT,
    STEAK,
    VEGETARIAN,
    FASTFOOD,
    CHICKEN,
    SUSHI,
    SPICYFOOD,
    NOODLES,
    FISHDISHED,
    FRUIT,
    COCKTAIL,
    BREAKFAST,
    NIGHTCLUB,
    MUSICHALL,
    BAKERY
}

export enum StoreCuisine {
    Ainu,
    Albanian,
    Argentina,
    Andhra,
    AngloIndian,
    Arab,
    Armenian,
    Assyrian,
    Awadhi,
    Azerbaijani,
    Balochi,
    Belarusian,
    Bengali,
    Berber,
    Buddhist,
    Bulgarian,
    Cajun,
    Chechen,
    Chinese,
    ChineseIslamic,
    Circassian,
    CrimeanTatar,
    Danish,
    Estonian,
    French,
    Filipino,
    Georgian,
    Goan,
    GoanCatholic,
    Greek,
    Hyderabad,
    Indian,
    IndianChinese,
    IndianSingaporean,
    Indonesian,
    Inuit,
    ItalianAmerican,
    Italian,
    Japanese,
    Jewish,
    Karnataka,
    Kazakh,
    Keralite,
    Korean,
    Kurdish,
    Laotian,
    Latvian,
    Lithuanian,
    LouisianaCreole,
    Maharashtrian,
    Mangalorean,
    Malay,
    MalaysianChinese,
    MalaysianIndian,
    Mediterranean,
    Mexican,
    Mordovian,
    Mughal,
    NativeAmerican,
    Nepalese,
    NewMexican,
    Odia,
    Parsi,
    Pashtun,
    Polish,
    PennsylvaniaDutch,
    Pakistani,
    Peranakan,
    Persian,
    Peruvian,
    Portuguese,
    Punjabi,
    Rajasthani,
    Romanian,
    Russian,
    Sami,
    Serbian,
    Sindhi,
    Slovak,
    Slovenian,
    Somali,
    SouthIndian,
    SriLankan,
    Tatar,
    Thai,
    Turkish,
    Tamil,
    Udupi,
    Ukrainian,
    Yamal,
    Zanzibari
}