import { Request, Response } from "express";
import { OrderStatus, Order, ReceiptStatus, Receipt } from "../../models/store/menu";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { Product } from "../../models/store/product";
import { Check, CheckProduct } from "../../models/store/check";
import { createLog, LogType } from "../../utils/logger";

export const acceptReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const StoreDatabase = await StoreDB(StoreID);

    let Receipt: Receipt = req.body.receipt;
    Receipt.status = ReceiptStatus.READY; Receipt.timestamp = Date.now();

    StoreDatabase.put(Receipt).then(isOk => {
        res.status(200).json({ ok: true, message: 'Ödeme Kabul Edildi!' })
    }).catch(err => {
        res.status(404).json({ ok: false, message: 'Ödeme Kabul Edildilirken Hata Oluştu!' })
        createLog(req, LogType.DATABASE_ERROR, err)
    })
}

export const approoveReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const StoreDatabase = await StoreDB(StoreID);

    const approveTime = Date.now();
    let Order: Order = req.body.order;

    StoreDatabase.find({ selector: { db_name: 'products' } }).then((product_res) => {
        const Products = product_res.docs;
        StoreDatabase.get(Order.check).then((check: Check) => {
            Order.items.forEach(orderItem => {
                let mappedProduct: Product = Products.find(product => product._id == orderItem.product_id || product.name == orderItem.name);
                let newProduct: CheckProduct =
                {
                    id: mappedProduct._id,
                    cat_id: mappedProduct.cat_id,
                    name: mappedProduct.name + (orderItem.type ? ' ' + orderItem.type : ''),
                    price: orderItem.price,
                    note: orderItem.note,
                    status: 2,
                    owner: 'Mobile',
                    timestamp: approveTime,
                    tax_value: mappedProduct.tax_value,
                    barcode: mappedProduct.barcode
                };
                check.total_price = check.total_price + newProduct.price;
                check.products.push(newProduct);
            })
            return check;
        }).then(Check => {
            StoreDatabase.put(Check).then(isOk => {
                Order.status = OrderStatus.APPROVED;
                Order.timestamp = approveTime;
                StoreDatabase.put(Order).then(isOk => {
                    res.status(200).json({ ok: true, message: 'Ödeme Kabul Edildi!' })
                }).catch(err => {
                    res.status(404).json({ ok: false, message: 'Ödeme Onaylanırken Hata Oluştu!' })
                    createLog(req, LogType.DATABASE_ERROR, err)
                })
            }).catch(err => {
                res.status(404).json({ ok: false, message: 'Ödeme Onaylanırken Hata Oluştu!' })
                createLog(req, LogType.DATABASE_ERROR, err)

            })
        }).catch(err => {
            res.status(404).json({ ok: false, message: 'Ödeme Onaylanırken Hata Oluştu!' })
            createLog(req, LogType.DATABASE_ERROR, err)
        })
    });
}

export const cancelReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const StoreDatabase = await StoreDB(StoreID);

    let Receipt: Receipt = req.body.receipt;
    Receipt.status = ReceiptStatus.READY; Receipt.timestamp = Date.now();

    StoreDatabase.put(Receipt).then(isOk => {
        res.status(200).json({ ok: true, message: 'Ödeme İptal Edildi!' })
    }).catch(err => {
        res.status(404).json({ ok: false, message: 'Ödeme İptal Edildilirken Hata Oluştu!' })
        createLog(req, LogType.DATABASE_ERROR, err)
    })
}