import { Request, Response } from "express";
import { OrderStatus, Order } from "../../models/store/menu";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { Product } from "../../models/store/product";
import { Check, CheckProduct } from "../../models/store/check";
import { createLog, LogType } from "../../utils/logger";
import { CountData, countProductsData, updateProductReport } from "../../functions/store/products";

export const acceptOrder = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const StoreDatabase = await StoreDB(StoreID);
    let Order: Order = req.body.order;
    Order.status = OrderStatus.PREPARING;
    StoreDatabase.put(Order).then(isOk => {
        res.status(200).json({ ok: true, message: 'Sipariş Kabul Edildi!' })
    }).catch(err => {
        res.status(404).json({ ok: false, message: 'Sipariş Kabul Edildilirken Hata Oluştu!' })
        createLog(req, LogType.DATABASE_ERROR, err)
    })
}

export const approoveOrder = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const StoreDatabase = await StoreDB(StoreID);
    const ApproveTime = Date.now();

    let Order: Order = req.body.order;
    let CountData: Array<CountData> = [];

    StoreDatabase.find({ selector: { db_name: 'products' }, limit: DatabaseQueryLimit }).then((product_res) => {
        const Products = product_res.docs;
        StoreDatabase.get(Order.check).then((check: Check) => {
            Order.items.forEach(orderItem => {
                const mappedProduct: Product = Products.find(product => product._id == orderItem.product_id || product.name == orderItem.name);
                const newProduct: CheckProduct = {
                    id: mappedProduct._id,
                    cat_id: mappedProduct.cat_id,
                    name: mappedProduct.name + (orderItem.type ? ' ' + orderItem.type : ''),
                    price: orderItem.price,
                    note: orderItem.note,
                    status: 2,
                    owner: Order.user.name,
                    timestamp: ApproveTime,
                    tax_value: mappedProduct.tax_value,
                    barcode: mappedProduct.barcode,
                    order_id:Order._id
                };
                countProductsData(CountData, newProduct.id, newProduct.price)
                check.total_price = check.total_price + newProduct.price;
                check.products.push(newProduct);
            })
            return check;
        }).then(Check => {
            StoreDatabase.put(Check).then(isOk => {
                updateProductReport(StoreID, CountData)
                Order.status = OrderStatus.APPROVED;
                Order.timestamp = ApproveTime;
                StoreDatabase.put(Order).then(isOk => {
                    res.status(200).json({ ok: true, message: 'Sipariş Onaylandı Edildi!' })
                }).catch(err => {
                    res.status(404).json({ ok: false, message: 'Sipariş Onaylanırken Hata Oluştu!' })
                    createLog(req, LogType.DATABASE_ERROR, err)
                })
            }).catch(err => {
                res.status(404).json({ ok: false, message: 'Sipariş Onaylanırken Hata Oluştu!' })
                createLog(req, LogType.DATABASE_ERROR, err)
            })
        }).catch(err => {
            res.status(404).json({ ok: false, message: 'Sipariş Onaylanırken Hata Oluştu!' })
            createLog(req, LogType.DATABASE_ERROR, err)

        })
    });
}

export const cancelOrder = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const StoreDatabase = await StoreDB(StoreID);

    let Order: Order = req.body.order;
    Order.status = OrderStatus.CANCELED;
    Order.timestamp = Date.now();

    StoreDatabase.put(Order).then(isOk => {
        res.status(200).json({ ok: true, message: 'Sipariş İptal Edildi!' })
    }).catch(err => {
        res.status(404).json({ ok: false, message: 'Sipariş İptal Edildilirken Hata Oluştu!' })
        createLog(req, LogType.DATABASE_ERROR, err)
    })
}