import { Request, Response } from "express";
import { OrderStatus, Order, ReceiptStatus, Receipt, ReceiptMethod } from "../../models/store/menu";
import { StoreDB, DatabaseQueryLimit, OrderDB } from '../../configrations/database';
import { Product } from "../../models/store/product";
import { Check, CheckProduct, PaymentStatus } from "../../models/store/check";
import { User } from '../../models/store/menu';
import { createLog, LogType } from "../../utils/logger";
import { ReceiptMessages } from "../../utils/messages";

////// /receipt [POST]
export const createReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        let ReceiptWillCreate: Receipt = { db_name: 'receipts', db_seq: 0, ...req.body };
        let Receipt = await StoresDB.post(ReceiptWillCreate);
        if (Receipt.ok) {
            res.status(ReceiptMessages.RECEIPT_CREATED.code).json(ReceiptMessages.RECEIPT_CREATED.response);
        } else {
            res.status(ReceiptMessages.RECEIPT_NOT_CREATED.code).json(ReceiptMessages.RECEIPT_NOT_CREATED.response);
        }
    } catch (error) {
        res.status(ReceiptMessages.RECEIPT_NOT_CREATED.code).json(ReceiptMessages.RECEIPT_NOT_CREATED.response);
    }
}

////// /receipt/:id [DELETE]
export const deleteReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Receipt = await StoresDB.get(req.params.id);
        StoresDB.remove(Receipt);
        res.status(ReceiptMessages.RECEIPT_DELETED.code).json(ReceiptMessages.RECEIPT_DELETED.response);
    } catch (error) {
        res.status(ReceiptMessages.RECEIPT_NOT_DELETED.code).json(ReceiptMessages.RECEIPT_NOT_DELETED.response);
    }

}

////// /receipt/:id [PUT]
export const updateReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Receipt = await StoresDB.get(req.params.id);
        await StoresDB.put({ Receipt, ...req.body });
        res.status(ReceiptMessages.RECEIPT_UPDATED.code).json(ReceiptMessages.RECEIPT_UPDATED.response);
    } catch (error) {
        res.status(ReceiptMessages.RECEIPT_NOT_UPDATED.code).json(ReceiptMessages.RECEIPT_NOT_UPDATED.response);
    }

}

////// /receipt/:id [POST]
export const getReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Receipt = await StoresDB.get(req.params.id);
        res.json(Receipt);
    } catch (error) {
        res.status(ReceiptMessages.RECEIPT_NOT_EXIST.code).json(ReceiptMessages.RECEIPT_NOT_EXIST.response);
    }
}

////// /receipts + QueryString [GET]
export const queryReceipts = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Receipts = await StoresDB.find({ selector: { db_name: 'receipts', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Receipts.docs);
    } catch (error) {
        res.status(ReceiptMessages.RECEIPT_NOT_EXIST.code).json(ReceiptMessages.RECEIPT_NOT_EXIST.response);
    }
}

////// /receipt/accept [POST]
export const acceptReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const StoreDatabase = await StoreDB(StoreID);
    let Receipt: Receipt = req.body.receipt;
    // if (Receipt.status == ReceiptStatus.WAITING) {
    Receipt.status = ReceiptStatus.READY;
    Receipt.timestamp = Date.now();
    StoreDatabase.put(Receipt).then(isOk => {
        res.status(200).json({ ok: true, message: 'Ödeme Kabul Edildi!' });
    }).catch(err => {
        res.status(404).json({ ok: false, message: 'Ödeme Kabul Edildilirken Hata Oluştu!' });
        createLog(req, LogType.DATABASE_ERROR, err)
    });
    // } else {
    //     res.status(404).json({ ok: false, message: 'Ödeme Kabul Edildilirken Hata Oluştu!' });
    // }
}

////// /receipt/approovee [POST]
export const approoveReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const StoreDatabase = await StoreDB(StoreID);
    let Receipt: Receipt = req.body.receipt;
    try {
        const Token = Receipt.check;
        const orderRequestType = await StoreDatabase.get(Token);
        switch (orderRequestType.db_name) {
            case 'checks':
                const Database = await OrderDB(StoreID, Token, false);

                let Check: Check = orderRequestType;
                let User: User = Receipt.user;

                let userItems = Receipt.orders.filter(order => order.status == OrderStatus.APPROVED);

                userItems.map(obj => {
                    obj.status = OrderStatus.PAYED;
                    return obj;
                })

                /////////// Check Operations ////////////
                let productsWillPay: Array<CheckProduct> = Check.products.filter(product => userItems.map(obj => obj.timestamp).includes(product.timestamp));

                let receiptMethod: 'Nakit' | 'Kart' | 'Kupon' | 'İkram' = (Receipt.method == ReceiptMethod.CARD ? 'Kart' : Receipt.method == ReceiptMethod.CASH ? 'Nakit' : Receipt.method == ReceiptMethod.COUPON ? 'Kupon' : 'İkram')

                const newPayment: PaymentStatus = { owner: User.name, method: receiptMethod, amount: Receipt.total, discount: Receipt.discount, timestamp: Date.now(), payed_products: productsWillPay };
                if (Check.payment_flow == undefined) {
                    Check.payment_flow = [];
                }
                Check.payment_flow.push(newPayment);
                Check.discount += newPayment.amount;
                Check.products = Check.products.filter(product => !productsWillPay.includes(product));
                Check.total_price = Check.products.map(product => product.price).reduce((a, b) => a + b, 0);

                /////////// Check Operations ////////////

                Receipt.status = ReceiptStatus.APPROVED;
                Receipt.timestamp = Date.now();

                Database.bulkDocs(userItems).then(order_res => {
                    Database.put(Receipt).then(isOK => {
                        StoreDatabase.put(Check).then(isCheckUpdated => {
                            if (isCheckUpdated.ok) {
                                res.status(200).json({ ok: true, receipt: Receipt });
                            }
                        }).catch(err => {
                            console.log('Check Update Error on Payment Process', err);
                            res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                        })
                    }).catch(err => {
                        console.log('Receipt Update Error on Payment Process', err);
                        res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                    })
                }).catch(err => {
                    console.log('Orders Update Error on Payment Process', err);
                    res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })

                })
                break;
            case 'customers':
                let Customer = orderRequestType;
                Receipt.status = ReceiptStatus.APPROVED;
                delete Receipt.orders[0]._rev;
                StoreDatabase.put(Receipt.orders[0]).then(order_res => {
                    Receipt.orders[0].status = OrderStatus.PREPARING;
                    delete Receipt._rev;
                    StoreDatabase.put(Receipt).then(isOk => {
                        res.status(200).json({ ok: true, receipt: Receipt });
                    }).catch(err => {
                        res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                    })
                }).catch(err => {
                    res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                })
                break;
            default:
                res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                break;
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
    }
}

////// /receipt/cancel [POST]
export const cancelReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const StoreDatabase = await StoreDB(StoreID);
    let Receipt: Receipt = req.body.receipt;
    // if (Receipt.status == ReceiptStatus.WAITING || Receipt.status == ReceiptStatus.READY) {
    Receipt.status = ReceiptStatus.CANCELED;
    Receipt.timestamp = Date.now();
    StoreDatabase.put(Receipt).then(isOk => {
        res.status(200).json({ ok: true, message: 'Ödeme İptal Edildi!' })
    }).catch(err => {
        res.status(404).json({ ok: false, message: 'Ödeme İptal Edildilirken Hata Oluştu!' })
        createLog(req, LogType.DATABASE_ERROR, err)
    })
    // } else {
    //     res.status(404).json({ ok: false, message: 'Ödeme İptal Edildilirken Hata Oluştu!' })
    // }
}