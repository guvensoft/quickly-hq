import { Response, Request } from "express";
import { ManagementDB, DatabaseQueryLimit } from "../../configrations/database";
import { ProductMessages } from '../../utils/messages';
import { createLog, LogType } from '../../utils/logger';
import { Product } from "../../models/management/product";


//////  /product [POST]
export const createProduct = (req: Request, res: Response) => {
    let newProduct: Product = req.body;
    ManagementDB.Products.find({ selector: { name: newProduct.name } }).then(products => {
        if (products.docs.length > 0) {
            res.status(ProductMessages.PRODUCT_EXIST.code).json(ProductMessages.PRODUCT_EXIST.response);
        } else {
            newProduct.timestamp = Date.now();
            ManagementDB.Products.post(newProduct).then(db_res => {
                res.status(ProductMessages.PRODUCT_CREATED.code).json(ProductMessages.PRODUCT_CREATED.response);
            }).catch((err) => {
                res.status(ProductMessages.PRODUCT_NOT_CREATED.code).json(ProductMessages.PRODUCT_NOT_CREATED.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            })
        }
    }).catch((err) => {
        res.status(ProductMessages.PRODUCT_NOT_CREATED.code).json(ProductMessages.PRODUCT_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /product/:id [PUT]
export const updateProduct = (req: Request, res: Response) => {
    let productID = req.params.id;
    let formData = req.body;
    ManagementDB.Products.get(productID).then(obj => {
        ManagementDB.Products.put(Object.assign(obj, formData)).then(() => {
            res.status(ProductMessages.PRODUCT_UPDATED.code).json(ProductMessages.PRODUCT_UPDATED.response);
        }).catch(err => {
            res.status(ProductMessages.PRODUCT_NOT_UPDATED.code).json(ProductMessages.PRODUCT_NOT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(ProductMessages.PRODUCT_NOT_EXIST.code).json(ProductMessages.PRODUCT_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /product/:id [GET]
export const getProduct = (req: Request, res: Response) => {
    let productID = req.params.id;
    ManagementDB.Products.get(productID).then((obj: any) => {
        res.send(obj);
    }).catch(err => {
        res.status(ProductMessages.PRODUCT_NOT_EXIST.code).json(ProductMessages.PRODUCT_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /product/:id [DELETE]
export const deleteProduct = (req: Request, res: Response) => {
    let productID = req.params.id;
    ManagementDB.Products.get(productID).then(obj => {
        ManagementDB.Products.remove(obj).then(() => {
            res.status(ProductMessages.PRODUCT_DELETED.code).json(ProductMessages.PRODUCT_DELETED.response);
        }).catch(err => {
            res.status(ProductMessages.PRODUCT_NOT_DELETED.code).json(ProductMessages.PRODUCT_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(ProductMessages.PRODUCT_NOT_EXIST.code).json(ProductMessages.PRODUCT_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /products + QueryString [GET]
export const queryProducts = (req: Request, res: Response) => {
    let qRegex = req.query.regex;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    if (qRegex) {
        req.query.name = JSON.parse(req.query.name);
        delete req.query.regex;
    }
    ManagementDB.Products.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        res.status(ProductMessages.PRODUCT_NOT_EXIST.code).json(ProductMessages.PRODUCT_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};