import { Response, Request } from "express";
import { ManagementDB, DatabaseQueryLimit } from "../../configrations/database";
import { BrandMessages } from '../../utils/messages';
import { createLog, LogType } from '../../utils/logger';
import { Brand } from "../../models/management/brand";


//////  /brand [POST]
export const createBrand = (req: Request, res: Response) => {
    let newBrand: Brand = req.body;
    ManagementDB.Brands.find({ selector: { name: newBrand.name } }).then(brands => {
        if (brands.docs.length > 0) {
            res.status(BrandMessages.BRAND_EXIST.code).json(BrandMessages.BRAND_EXIST.response);
        } else {
            newBrand.timestamp = Date.now();
            ManagementDB.Brands.post(newBrand).then(db_res => {
                res.status(BrandMessages.BRAND_CREATED.code).json(BrandMessages.BRAND_CREATED.response);
            }).catch((err) => {
                res.status(BrandMessages.BRAND_NOT_CREATED.code).json(BrandMessages.BRAND_NOT_CREATED.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            })
        }
    }).catch((err) => {
        res.status(BrandMessages.BRAND_NOT_CREATED.code).json(BrandMessages.BRAND_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /brand/:id [PUT]
export const updateBrand = (req: Request, res: Response) => {
    let brandID = req.params.id;
    let formData = req.body;
    ManagementDB.Brands.get(brandID).then(obj => {
        ManagementDB.Brands.put(Object.assign(obj, formData)).then(() => {
            res.status(BrandMessages.BRAND_UPDATED.code).json(BrandMessages.BRAND_UPDATED.response);
        }).catch(err => {
            res.status(BrandMessages.BRAND_NOT_UPDATED.code).json(BrandMessages.BRAND_NOT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(BrandMessages.BRAND_NOT_EXIST.code).json(BrandMessages.BRAND_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /brand/:id [GET]
export const getBrand = (req: Request, res: Response) => {
    let brandID = req.params.id;
    ManagementDB.Brands.get(brandID).then((obj: any) => {
        res.send(obj);
    }).catch(err => {
        res.status(BrandMessages.BRAND_NOT_EXIST.code).json(BrandMessages.BRAND_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /brand/:id [DELETE]
export const deleteBrand = (req: Request, res: Response) => {
    let brandID = req.params.id;
    ManagementDB.Brands.get(brandID).then(obj => {
        ManagementDB.Brands.remove(obj).then(() => {
            res.status(BrandMessages.BRAND_DELETED.code).json(BrandMessages.BRAND_DELETED.response);
        }).catch(err => {
            res.status(BrandMessages.BRAND_NOT_DELETED.code).json(BrandMessages.BRAND_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(BrandMessages.BRAND_NOT_EXIST.code).json(BrandMessages.BRAND_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /brands + QueryString [GET]
export const queryBrands = (req: Request, res: Response) => {
    let qRegex = req.query.regex;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    if (qRegex) {
        req.query.name = JSON.parse(req.query.name);
        delete req.query.regex;
    }
    ManagementDB.Brands.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        res.status(BrandMessages.BRAND_NOT_EXIST.code).json(BrandMessages.BRAND_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};