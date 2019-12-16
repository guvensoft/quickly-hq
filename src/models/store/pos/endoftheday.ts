export interface EndDay {
    timestamp: number,
    owner: string,
    total_income: number,
    cash_total: number,
    card_total: number,
    coupon_total: number,
    free_total: number,
    canceled_total: number,
    check_count: number,
    incomes: number,
    outcomes: number,
    data_file: string,
    _id?:string,
    _rev?:string
}
export interface BackupData {
    database:string,
    docs:Array<any>
}
