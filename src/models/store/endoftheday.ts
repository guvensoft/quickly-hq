import { Report } from "./report";
import { ClosedCheck } from "./check";
import { Log } from "./log";
import { Cashbox } from "./cashbox";

export interface EndDay {
    timestamp: number,
    owner: string,
    total_income: number,
    cash_total: number,
    card_total: number,
    coupon_total: number,
    free_total: number,
    canceled_total: number,
    discount_total: number,
    check_count: number,
    incomes: number,
    outcomes: number,
    customers: { male: number, female: number },
    data_file: string,
    _id?: string,
    _rev?: string
}
export interface BackupData {
    database: 'closed_checks' | 'logs' | 'cashbox' | 'reports',
    docs: Array<any>;
}
