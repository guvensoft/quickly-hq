import { Request, Response } from "express";
import { ManagementDB, StoreCollection, DatabaseQueryLimit } from '../../configrations/database';
import { Store } from '../../models/social/stores';
import { StoreMessages } from '../../utils/messages';
import { CashboxType } from "../../models/store/pos/cashbox.mock";

export const listStores = async (req: Request, res: Response) => {
    ManagementDB.Stores.find({ selector: {}, limit: DatabaseQueryLimit, skip: 0 }).then((db_res: any) => {
        let Stores: Array<Store> = db_res.docs;
        ManagementDB.Owners.get(req.app.locals.user).then(Owner => {
            let OwnerStores = Stores.filter(store => Owner.stores.includes(store._id));
            res.json(OwnerStores);
        }).catch(err => {
            res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        })
    }).catch(err => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
    })
}

export const storesInfo = (req: Request, res: Response) => {
    ManagementDB.Stores.find({ selector: {}, limit: DatabaseQueryLimit, skip: 0 }).then((db_res: any) => {
        let Stores: Array<Store> = db_res.docs;
        ManagementDB.Owners.get(req.app.locals.user).then(Owner => {
            let Response: Array<any> = [];
            let OwnerStores = Stores.filter(store => Owner.stores.includes(store._id));

            OwnerStores.forEach((store, index) => {

                StoreCollection(store._id).then(StoreDatabase => {

                    let StoreInfoObject: any = {};

                    StoreInfoObject._id = store._id;
                    StoreInfoObject.tables = {};
                    StoreInfoObject.cashbox = {};
                    StoreInfoObject.payments = {};

                    const tablesInfo = StoreDatabase.find({ selector: { db_name: 'tables' }, limit: 1000 }).then((db_res: any) => {
                        StoreInfoObject.tables.ready = db_res.docs.filter(obj => obj.status == 1).length;
                        StoreInfoObject.tables.occupied = db_res.docs.filter(obj => obj.status == 2).length;
                        StoreInfoObject.tables.will_ready = db_res.docs.filter(obj => obj.status == 3).length;
                    })
                    const cashboxInfo = StoreDatabase.find({ selector: { db_name: 'cashbox' }, limit: 1000 }).then((db_res: any) => {
                        StoreInfoObject.cashbox.income = db_res.docs.filter(obj => obj.type == CashboxType.INCOME).reduce((a, b) => a + b, 0);
                        StoreInfoObject.cashbox.outcome = db_res.docs.filter(obj => obj.type == CashboxType.OUTCOME).reduce((a, b) => a + b, 0);
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
                    })
                    Promise.all([tablesInfo, cashboxInfo, paymentsInfo]).finally(() => {
                        Response.push(StoreInfoObject);
                        if (index == OwnerStores.length - 1) {
                            res.json(Response);
                        }
                    });
                });
            });


        }).catch(err => {
            res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        })
    }).catch(err => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
    })
}