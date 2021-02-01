import { Table, TableStatus } from "../../models/store/table";
import { Cashbox } from "../../models/store/cashbox";
import { Check, ClosedCheck, CheckType } from "../../models/store/check";
import { StoreTablesInfo, StoreChecksInfo, StoreCashboxesInfo, StorePaymentsInfo } from "../../models/store/info";

export const storePaymentsInfo = (closed_checks: Array<ClosedCheck>) => {
    let paymentsInfo: StorePaymentsInfo = { cash: 0, card: 0, coupon: 0, free: 0, canceled: 0, discount: 0, count: closed_checks.length, customers: { male: 0, female: 0 } };
    paymentsInfo.cash = closed_checks.filter(obj => obj.payment_method == 'Nakit').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    paymentsInfo.card = closed_checks.filter(obj => obj.payment_method == 'Kart').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    paymentsInfo.coupon = closed_checks.filter(obj => obj.payment_method == 'Kupon').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    paymentsInfo.free = closed_checks.filter(obj => obj.type !== CheckType.CANCELED && obj.payment_method == 'İkram').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    paymentsInfo.canceled = closed_checks.filter(obj => obj.type == CheckType.CANCELED).map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    paymentsInfo.discount = closed_checks.filter(obj => obj.type !== CheckType.CANCELED).map(obj => obj.discount).reduce((a, b) => a + b, 0);
    paymentsInfo.customers.male = closed_checks.filter(obj => obj.type !== CheckType.CANCELED && obj.hasOwnProperty('occupation')).map(obj => obj.occupation.male).reduce((a, b) => a + b, 0);
    paymentsInfo.customers.female = closed_checks.filter(obj => obj.type !== CheckType.CANCELED && obj.hasOwnProperty('occupation')).map(obj => obj.occupation.female).reduce((a, b) => a + b, 0);
    const partial = closed_checks.filter(obj => obj.payment_method == 'Parçalı');
    partial.forEach(element => {
        paymentsInfo.discount += element.discount;
        element.payment_flow.forEach(payment => {
            if (payment.method == 'Nakit') {
                paymentsInfo.cash += payment.amount;
            }
            if (payment.method == 'Kart') {
                paymentsInfo.card += payment.amount;
            }
            if (payment.method == 'Kupon') {
                paymentsInfo.coupon += payment.amount;
            }
            if (payment.method == 'İkram') {
                paymentsInfo.free += payment.amount;
            }
        })
    });
    return paymentsInfo;
}

export const storeTablesInfo = (tables: Array<Table>) => {
    let tableInfo: StoreTablesInfo = { ready: 0, occupied: 0, will_ready: 0 };
    try {
        tableInfo.ready = tables.filter(obj => obj.status == TableStatus.ACTIVE).length;
        tableInfo.occupied = tables.filter(obj => obj.status == TableStatus.OCCUPIED).length;
        tableInfo.will_ready = tables.filter(obj => obj.status == TableStatus.WILL_READY).length;
        return tableInfo;
    } catch (error) {
        return tableInfo;
    }
}

export const storeChecksInfo = (checks: Array<Check>) => {
    let checksInfo: StoreChecksInfo = { total: 0, count: checks.length, customers: { male: 0, female: 0 } }
    checksInfo.total = checks.map(obj => obj.total_price + obj.discount).reduce((a, b) => a + b, 0);
    checksInfo.customers.male = checks.filter(obj => obj.hasOwnProperty('occupation')).map(obj => obj.occupation.male).reduce((a, b) => a + b, 0);
    checksInfo.customers.female = checks.filter(obj => obj.hasOwnProperty('occupation')).map(obj => obj.occupation.female).reduce((a, b) => a + b, 0);
    return checksInfo;
}


export const storeCashboxInfo = (cashboxes: Array<Cashbox>) => {
    let cashboxesInfo: StoreCashboxesInfo = { income: 0, outcome: 0 };
    try {
        cashboxesInfo.income = cashboxes.filter(obj => obj.type == 'Gelir').map(obj => obj.coupon + obj.card + obj.cash).reduce((a, b) => a + b, 0);
        cashboxesInfo.outcome = cashboxes.filter(obj => obj.type == 'Gider').map(obj => obj.coupon + obj.card + obj.cash).reduce((a, b) => a + b, 0);
        return cashboxesInfo;
    } catch (error) {
        return cashboxesInfo;
    }
}