import { Response, Request } from "express";
import { ManagementDB, DatabaseQueryLimit, StoreDB } from "../../configrations/database";
import { createLog, LogType } from '../../utils/logger';
import { productToStock } from "../../functions/stocks";

//////  /add_stock/:product_id:/:quantity [POST]
export const addStock = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const ProductID = req.params.product_id;
    const quantity = <number><unknown>req.params.quantity || 10;
    try {
        const StoresDB = await StoreDB(StoreID);

        const product = await ManagementDB.Products.get(ProductID);
        const StockSubCategory = await ManagementDB.SubCategories.get(product.sub_category);

        const isAlreadyAdded = await StoresDB.find({ selector: { db_name: 'stocks', product: ProductID } });
        const isStockHaveCategory = await StoresDB.find({ selector: { db_name: 'stocks_cat', name: StockSubCategory.name } });

        if (isAlreadyAdded.docs.length > 0) {
            res.status(400).json({ ok: false, message: 'Already Added' });
        } else {
            if (isStockHaveCategory.docs.length == 0) {
                StoresDB.post({ db_name: 'stocks_cat', name: StockSubCategory.name, description: StockSubCategory.description, db_seq: 0 }).then(stock_category => {
                    StoresDB.post({ db_name: 'stocks', ...productToStock(product, quantity) });
                    res.status(200).json({ ok: true, message: `${quantity} adet ürün Stok'a eklendi!` });
                }).catch(err => {
                    res.status(500).json({ ok: false, message: '' });
                });
            } else {
                StoresDB.post({ db_name: 'stocks', ...productToStock(product, quantity) });
                res.status(200).json({ ok: true, message: `${quantity} adet ürün Stok'a eklendi!` });
            }
        }
    } catch (error) {
        res.status(500).json({ ok: false, message: '' });
    }
};