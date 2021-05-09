import { Request, Response } from "express";
import { OrderStatus, Order, ReceiptStatus, Receipt, ReceiptMethod } from "../../models/store/menu";
import { StoreDB, DatabaseQueryLimit, OrderDB } from '../../configrations/database';
import { Product } from "../../models/store/product";
import { Check, CheckProduct, PaymentStatus } from "../../models/store/check";
import { User } from '../../models/store/menu';
import { createLog, LogType } from "../../utils/logger";

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