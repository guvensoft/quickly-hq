import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { ProductMessages } from '../../utils/messages';
import { Report } from "../../models/store/report";
import { Product } from "../../models/store/product";
import { createReport } from "../../functions/store/reports";


////// /product [POST]
export const createProduct = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        let ProductWillCreate: Product = { db_name: 'products', db_seq: 0, ...req.body };
        let Product = await StoresDB.post(ProductWillCreate);
        ProductWillCreate._id = Product.id;
        ProductWillCreate._rev = Product.rev;
        let ProductReport = { db_name: 'reports', db_seq: 0, ...createReport('Product', ProductWillCreate) }
        const isCreated = await StoresDB.post(ProductReport)
        if (isCreated && Product.ok) {
            res.status(ProductMessages.PRODUCT_CREATED.code).json(ProductMessages.PRODUCT_CREATED.response);
        } else {
            res.status(ProductMessages.PRODUCT_NOT_CREATED.code).json(ProductMessages.PRODUCT_NOT_CREATED.response);
        }
    } catch (error) {
        res.status(ProductMessages.PRODUCT_NOT_CREATED.code).json(ProductMessages.PRODUCT_NOT_CREATED.response);
    }
}


////// /product/:id [DELETE]
export const deleteProduct = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Product = await StoresDB.get(req.params.id);
        const ProductReport = await StoresDB.find({ selector: { db_name: 'reports', connection_id: Product._id } });
        StoresDB.remove(Product);
        StoresDB.remove(ProductReport.docs[0]);
        res.status(ProductMessages.PRODUCT_DELETED.code).json(ProductMessages.PRODUCT_DELETED.response);
    } catch (error) {
        res.status(ProductMessages.PRODUCT_NOT_DELETED.code).json(ProductMessages.PRODUCT_NOT_DELETED.response);
    }

}

////// /product/:id [PUT]
export const updateProduct = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Product = await StoresDB.get(req.params.id);
        await StoresDB.put({ Product, ...req.body });
        res.status(ProductMessages.PRODUCT_CREATED.code).json(ProductMessages.PRODUCT_CREATED.response);
    } catch (error) {
        res.status(ProductMessages.PRODUCT_NOT_CREATED.code).json(ProductMessages.PRODUCT_NOT_CREATED.response);
    }

}

////// /product/:id [GET]
export const getProduct = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Product = await StoresDB.get(req.params.id);
        res.json(Product);
    } catch (error) {
        res.status(ProductMessages.PRODUCT_NOT_CREATED.code).json(ProductMessages.PRODUCT_NOT_CREATED.response);
    }
}


////// /products + QueryString [GET]
export const queryProducts = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Products = await StoresDB.find({ selector: { db_name: 'products', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Products.docs);
    } catch (error) {
        res.status(ProductMessages.PRODUCT_NOT_EXIST.code).json(ProductMessages.PRODUCT_NOT_EXIST.response);
    }
}