export interface StoreInfo {
    store_id: string,
    tables: StoreTablesInfo,
    checks: StoreChecksInfo,
    cashbox: StoreCashboxesInfo,
    sales: StoreSalesInfo,
    orders?: StoreOrdersInfo,
    receipts?: StoreReceiptsInfo
}

export interface StoreReceiptsInfo {
    requested:number,
    waiting:number,
    ready:number,
    approved:number,
    canceled:number
}

export interface StoreOrdersInfo {
    waiting:number,
    preparing:number,
    approved:number,
    canceled:number,
}

export interface StoreSalesInfo {
    cash: number;
    card: number;
    coupon: number;
    free: number;
    canceled: number;
    discount: number;
    count: number;
    customers: {
        male: number;
        female: number;
    };
}

export interface StoreChecksInfo {
    total: number;
    count: number;
    customers: {
        male: number;
        female: number;
    };
}

export interface StoreTablesInfo {
    ready: number;
    occupied: number;
    will_ready: number;
}

export interface StoreCashboxesInfo {
    income: number;
    outcome: number;
}

export interface StoreStocksInfo {
    total:number,
    warning:number,
    empty:number,
}

export interface StoreSupplyInfo {
    waiting:number,
    ontheway:number,
    taken:number,
}

export interface StoreLogsInfo {
    notifications:number,
    warnings:number,
    checkpoints:number,
}