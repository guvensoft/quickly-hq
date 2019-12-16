import { Response, Request } from "express";
import { ManagementDB, DatabaseQueryLimit, StoreDB } from "../../configrations/database";
import { createLog, LogType } from '../../utils/logger';
import { productToStock } from "../../functions/stocks";

//////  /add_stock/:product_id:/:quantity [POST]
export const addStock = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const ProductID = req.params.product_id;
    const quantity = req.params.quantity || 10;
    try {
        const product = await ManagementDB.Products.get(ProductID);
        const StoresDB = await StoreDB(StoreID);
        const isAlreadyAdded = await StoresDB.find({ selector: { db_name: 'stocks', product: ProductID } });
        if (isAlreadyAdded.docs.length > 0) {
            res.status(400).json({ ok: false, message: 'Already Added' });
        } else {
            StoresDB.post({ db_name: 'stocks', ...productToStock(product, quantity) });
            res.status(200).json({ ok: true, message: `${quantity} adet ürün Stok'a eklendi!` });
        }
    } catch (error) {
        res.status(500).json({ ok: false, message: '' });
    }
};