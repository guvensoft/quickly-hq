import { Request, Response } from "express";
import { ManagementDB, StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { Store } from '../../models/management/store';
import { StoreMessages } from '../../utils/messages';
import { storeTablesInfo, storeCashboxInfo, storeChecksInfo, storePaymentsInfo, storeOrdersInfo, storeReceiptsInfo } from "../../functions/store/info";
import { Table } from "../../models/store/table";
import { Cashbox } from "../../models/store/cashbox";
import { Check } from "../../models/store/check";
import { ClosedCheck } from "../../models/store/check";
import { StoreInfo } from "../../models/store/info";
import { Order, Receipt } from "../../models/store/menu";

export const listStores = (req: Request, res: Response) => {
    ManagementDB.Stores.find({ selector: {}, limit: DatabaseQueryLimit, skip: 0 }).then((db_res: any) => {
        let Stores: Array<Store> = db_res.docs;
        const OwnerID = res.locals.user;
        ManagementDB.Owners.get(OwnerID).then(Owner => {
            let OwnerStores = Stores.filter(store => Owner.stores.includes(store._id));
            res.json(OwnerStores);
        }).catch(err => {
            res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        })
    }).catch(err => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
    })
}

export const storeInfo = async (req: Request, res: Response) => {
    const StoreID: any = req.headers.store;
    try {
        const StoreDatabase = await StoreDB(StoreID);
        let tables: Array<Table> = (await StoreDatabase.find({ selector: { db_name: 'tables' }, limit: DatabaseQueryLimit })).docs;
        let cashboxes: Array<Cashbox> = (await StoreDatabase.find({ selector: { db_name: 'cashbox' }, limit: DatabaseQueryLimit })).docs;
        let checks: Array<Check> = (await StoreDatabase.find({ selector: { db_name: 'checks' }, limit: DatabaseQueryLimit })).docs;
        let closed_checks: Array<ClosedCheck> = (await StoreDatabase.find({ selector: { db_name: 'closed_checks' }, limit: DatabaseQueryLimit })).docs;
        let orders: Array<Order> = (await StoreDatabase.find({ selector: { db_name: 'orders' }, limit: DatabaseQueryLimit })).docs;
        let receipts: Array<Receipt> = (await StoreDatabase.find({ selector: { db_name: 'receipts' }, limit: DatabaseQueryLimit })).docs;

        let StoreInfoObject: StoreInfo = {
            store_id: StoreID,
            tables: storeTablesInfo(tables),
            cashbox: storeCashboxInfo(cashboxes),
            checks: storeChecksInfo(checks),
            sales: storePaymentsInfo(closed_checks),
            orders: storeOrdersInfo(orders),
            receipts: storeReceiptsInfo(receipts)
        };
        res.status(200).json(StoreInfoObject);
    } catch (error) {
        res.status(500).json({ ok: false, message: 'İşletme Bilgileri Getirilirken Hata Oluştu' });
    }
}

export const storesInfo = (req: Request, res: Response) => {
    ManagementDB.Stores.find({ selector: {}, limit: DatabaseQueryLimit, skip: 0 }).then((db_res: any) => {
        let Stores: Array<Store> = db_res.docs;
        const OwnerID = res.locals.user;
        ManagementDB.Owners.get(OwnerID).then(Owner => {
            let Response: Array<any> = [];
            let OwnerStores = Stores.filter(store => Owner.stores.includes(store._id));
            OwnerStores.forEach((store, index) => {

                StoreDB(store._id).then(StoreDatabase => {

                    let StoreInfoObject: any = {};

                    StoreInfoObject._id = store._id;
                    StoreInfoObject.tables = {};
                    StoreInfoObject.cashbox = {};
                    StoreInfoObject.payments = {};
                    StoreInfoObject.checks = {};

                    const tablesInfo = StoreDatabase.find({ selector: { db_name: 'tables' }, limit: 1000 }).then((db_res: any) => {
                        StoreInfoObject.tables.ready = db_res.docs.filter(obj => obj.status == 1).length;
                        StoreInfoObject.tables.occupied = db_res.docs.filter(obj => obj.status == 2).length;
                        StoreInfoObject.tables.will_ready = db_res.docs.filter(obj => obj.status == 3).length;
                    }).catch(err => {
                        StoreInfoObject.tables.ready = 0;
                        StoreInfoObject.tables.occupied = 0;
                        StoreInfoObject.tables.will_ready = 0;
                    })
                    const cashboxInfo = StoreDatabase.find({ selector: { db_name: 'cashbox' }, limit: 1000 }).then((db_res: any) => {
                        StoreInfoObject.cashbox.income = db_res.docs.filter(obj => obj.type == 'Gelir').map(obj => obj.coupon + obj.card + obj.cash).reduce((a, b) => a + b, 0);
                        StoreInfoObject.cashbox.outcome = db_res.docs.filter(obj => obj.type == 'Gider').map(obj => obj.coupon + obj.card + obj.cash).reduce((a, b) => a + b, 0);
                    }).catch(err => {
                        StoreInfoObject.cashbox.income = 0;
                        StoreInfoObject.cashbox.outcome = 0;
                    })
                    const checksInfo = StoreDatabase.find({ selector: { db_name: 'checks' }, limit: 1000 }).then((db_res: any) => {
                        StoreInfoObject.checks.total = db_res.docs.map(obj => obj.total_price + obj.discount).reduce((a, b) => a + b, 0);
                    }).catch(err => {
                        StoreInfoObject.checks.total = 0;
                    })
                    const paymentsInfo = StoreDatabase.find({ selector: { db_name: 'closed_checks' }, limit: 1000 }).then((db_res: any) => {
                        StoreInfoObject.payments.cash = db_res.docs.filter(obj => obj.payment_method == 'Nakit').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                        StoreInfoObject.payments.card = db_res.docs.filter(obj => obj.payment_method == 'Kart').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                        StoreInfoObject.payments.coupon = db_res.docs.filter(obj => obj.payment_method == 'Kupon').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                        StoreInfoObject.payments.free = db_res.docs.filter(obj => obj.payment_method == 'İkram').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                        const partial = db_res.docs.filter(obj => obj.payment_method == 'Parçalı')
                        partial.forEach(element => {
                            element.payment_flow.forEach(payment => {
                                if (payment.method == 'Nakit') {
                                    StoreInfoObject.payments.cash += payment.amount;
                                }
                                if (payment.method == 'Kart') {
                                    StoreInfoObject.payments.card += payment.amount;
                                }
                                if (payment.method == 'Kupon') {
                                    StoreInfoObject.payments.coupon += payment.amount;
                                }
                                if (payment.method == 'İkram') {
                                    StoreInfoObject.payments.free += payment.amount;
                                }
                            })
                        })
                    }).catch(err => {
                        StoreInfoObject.payments.cash = 0;
                        StoreInfoObject.payments.card = 0;
                        StoreInfoObject.payments.coupon = 0;
                        StoreInfoObject.payments.free = 0;
                    })
                    Promise.all([tablesInfo, cashboxInfo, paymentsInfo, checksInfo]).finally(() => {
                        Response.push(StoreInfoObject);
                        if (Response.length == OwnerStores.length) {
                            res.json(Response);
                        }
                    })
                }).catch(err => {
                    console.log('Not Accessing Store DB');
                    console.log(err);
                });
            });
        }).catch(err => {
            res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        })
    }).catch(err => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
    })
}

// req: Request, res: Response
export const storesInfo2 = async (req: Request, res: Response) => {
    const OwnerID: string = 'bbe63bd6-b3bd-4011-ad7e-88180d3d0b0f' // req.app.locals.user;
    const OwnerStores = await (await ManagementDB.Owners.get(OwnerID)).stores;
    const Stores = await (await ManagementDB.Stores.allDocs({ include_docs: true, keys: OwnerStores })).rows.map(obj => obj.doc);

    ManagementDB.Owners.get(OwnerID).then(Owner => {
        let Response: Array<StoreInfo> = [];

        let OwnerStores = Stores.filter(store => Owner.stores.includes(store._id));

        OwnerStores.forEach((store, index) => {

            StoreDB(store._id).then(StoreDatabase => {

                let StoreInfoObject: any = {};

                StoreInfoObject._id = store._id;
                StoreInfoObject.tables = {};
                StoreInfoObject.cashbox = {};
                StoreInfoObject.payments = {};
                StoreInfoObject.checks = {};

                const tablesInfo = StoreDatabase.find({ selector: { db_name: 'tables' }, limit: 1000 }).then((db_res: any) => {
                    StoreInfoObject.tables.ready = db_res.docs.filter(obj => obj.status == 1).length;
                    StoreInfoObject.tables.occupied = db_res.docs.filter(obj => obj.status == 2).length;
                    StoreInfoObject.tables.will_ready = db_res.docs.filter(obj => obj.status == 3).length;
                }).catch(err => {
                    StoreInfoObject.tables.ready = 0;
                    StoreInfoObject.tables.occupied = 0;
                    StoreInfoObject.tables.will_ready = 0;
                })
                const cashboxInfo = StoreDatabase.find({ selector: { db_name: 'cashbox' }, limit: 1000 }).then((db_res: any) => {
                    StoreInfoObject.cashbox.income = db_res.docs.filter(obj => obj.type == 'Gelir').map(obj => obj.coupon + obj.card + obj.cash).reduce((a, b) => a + b, 0);
                    StoreInfoObject.cashbox.outcome = db_res.docs.filter(obj => obj.type == 'Gider').map(obj => obj.coupon + obj.card + obj.cash).reduce((a, b) => a + b, 0);
                }).catch(err => {
                    StoreInfoObject.cashbox.income = 0;
                    StoreInfoObject.cashbox.outcome = 0;
                })
                const checksInfo = StoreDatabase.find({ selector: { db_name: 'checks' }, limit: 1000 }).then((db_res: any) => {
                    StoreInfoObject.checks.total = db_res.docs.map(obj => obj.total_price + obj.discount).reduce((a, b) => a + b, 0);
                }).catch(err => {
                    StoreInfoObject.checks.total = 0;
                })
                const paymentsInfo = StoreDatabase.find({ selector: { db_name: 'closed_checks' }, limit: 1000 }).then((db_res: any) => {
                    StoreInfoObject.payments.cash = db_res.docs.filter(obj => obj.payment_method == 'Nakit').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                    StoreInfoObject.payments.card = db_res.docs.filter(obj => obj.payment_method == 'Kart').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                    StoreInfoObject.payments.coupon = db_res.docs.filter(obj => obj.payment_method == 'Kupon').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                    StoreInfoObject.payments.free = db_res.docs.filter(obj => obj.payment_method == 'İkram').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                    const partial = db_res.docs.filter(obj => obj.payment_method == 'Parçalı')
                    partial.forEach(element => {
                        element.payment_flow.forEach(payment => {
                            if (payment.method == 'Nakit') {
                                StoreInfoObject.payments.cash += payment.amount;
                            }
                            if (payment.method == 'Kart') {
                                StoreInfoObject.payments.card += payment.amount;
                            }
                            if (payment.method == 'Kupon') {
                                StoreInfoObject.payments.coupon += payment.amount;
                            }
                            if (payment.method == 'İkram') {
                                StoreInfoObject.payments.free += payment.amount;
                            }
                        })
                    })
                }).catch(err => {
                    StoreInfoObject.payments.cash = 0;
                    StoreInfoObject.payments.card = 0;
                    StoreInfoObject.payments.coupon = 0;
                    StoreInfoObject.payments.free = 0;
                })
                Promise.all([tablesInfo, cashboxInfo, paymentsInfo, checksInfo]).finally(() => {
                    Response.push(StoreInfoObject);
                    if (Response.length == OwnerStores.length) {
                        res.json(Response);
                    }
                })
            }).catch(err => {
                console.log('Not Accessing Store DB');
                console.log(err);
            });



        })
    })

}