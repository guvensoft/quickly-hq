export interface StoreInfo {
    store_id: string,
    tables: StoreTablesInfo,
    checks: StoreChecksInfo,
    cashbox: StoreCashboxesInfo,
    payments: StorePaymentsInfo,
}

export interface StorePaymentsInfo {
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