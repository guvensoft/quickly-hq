import { Response, Request } from "express";
import { ManagementDB, DatabaseQueryLimit, StoreDB } from "../../configrations/database";
import { createLog, LogType } from '../../utils/logger';
import { productToStock } from "../../functions/store/stocks";
import { Stock, StockCategory } from "../../models/store/stocks";

//////  /add_stock/:product_id:/:quantity [POST]
export const addStock = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const ProductID = req.params.product_id;
    const Quantity = parseInt(req.params.quantity) || 10;
    try {
        const StoreDatabase = await StoreDB(StoreID);

        const Product = await ManagementDB.Products.get(ProductID);
        const StockSubCategory = await ManagementDB.SubCategories.get(Product.sub_category);

        const isAlreadyAdded: Stock = (await StoreDatabase.find({ selector: { db_name: 'stocks', product: ProductID } ,limit:DatabaseQueryLimit })).docs[0];
        const isStockHaveCategory: StockCategory = (await StoreDatabase.find({ selector: { db_name: 'stocks_cat', name: StockSubCategory.name }, limit:DatabaseQueryLimit })).docs[0];

        if (isAlreadyAdded) {
            StoreDatabase.upsert(isAlreadyAdded._id, (stock: Stock) => {
                const old_quantity = stock.left_total / stock.total;
                const new_quantity = (old_quantity + Quantity);
                stock.quantity = new_quantity;
                stock.left_total = stock.left_total + (stock.total * Quantity);
                stock.first_quantity = new_quantity;
                stock.warning_limit = (stock.total * new_quantity) * 25 / 100;
                return stock;
            }).then(isOk => {
                res.status(200).json({ ok: true, message: `${Quantity} adet ürün Stok'a eklendi!` });
            }).catch(err => {
                res.status(500).json({ ok: false, message: 'Stok Eklenirken Hata Oluştu!' });
                createLog(req, LogType.CRUD_ERROR, err);
            })
        } else {
            if (!isStockHaveCategory) {
                StoreDatabase.put({ db_name: 'stocks_cat', name: StockSubCategory.name, description: StockSubCategory.description, db_seq: 0, _id:Product.sub_category }).then(stock_category => {
                    StoreDatabase.post({ db_name: 'stocks', ...productToStock(Product, Quantity) });
                    res.status(200).json({ ok: true, message: `${Quantity} adet ürün Stok'a eklendi!` });
                }).catch(err => {
                    res.status(500).json({ ok: false, message: 'Stok Eklenirken Hata Oluştu!' });
                    createLog(req, LogType.CRUD_ERROR, err);
                });
            } else {
                StoreDatabase.post({ db_name: 'stocks', ...productToStock(Product, Quantity) });
                res.status(200).json({ ok: true, message: `${Quantity} adet ürün Stok'a eklendi!` });
            }
        }
    } catch (error) {
        res.status(500).json({ ok: false, message: 'Stok Eklenirken Hata Oluştu!' });
        createLog(req, LogType.CRUD_ERROR, error);
    }
};