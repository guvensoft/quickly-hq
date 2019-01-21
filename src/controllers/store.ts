import { Response, Request } from "express";
import { ManagementDB } from "../databases/management";
import { Store } from "../models/social/stores";
import { StoreMessages } from "../utils/messages";
import { createLog, LogType } from '../utils/logger';

export const createStore = (req: Request, res: Response) => {
    let formData: Store = req.body;
    ManagementDB.Stores.find({ selector: { name: formData.name } }).then(group => {
        if (group.docs.length > 0) {
            res.status(StoreMessages.STORE_CREATED.code).json(StoreMessages.STORE_CREATED.response);
        } else {
            let userGroup = new Store(formData.name, formData.type, formData.category, formData.cuisine, formData.address, formData.email, formData.phone_number, formData.motto, formData.description, formData.logo, formData.settings, formData.status);
            ManagementDB.Stores.post(userGroup).then(db_res => {
                res.status(StoreMessages.STORE_CREATED.code).json(StoreMessages.STORE_CREATED.response);
            }).catch((err) => {
                createLog(req, LogType.DATABASE_ERROR, err);
                res.status(StoreMessages.STORE_NOT_CREATED.code).json(StoreMessages.STORE_NOT_CREATED.response);
            })
        }
    }).catch((err) => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(StoreMessages.STORE_NOT_CREATED.code).json(StoreMessages.STORE_NOT_CREATED.response);
    });
};

export const updateStore = (req: Request, res: Response) => {
    let storeID = req.params.id;
    let formData = req.body;
    ManagementDB.Stores.get(storeID).then(obj => {
        ManagementDB.Stores.put(Object.assign(obj, formData)).then(db_res => {
            res.status(StoreMessages.STORE_UPDATED.code).json(StoreMessages.STORE_UPDATED.response);
        }).catch((err) => {
            createLog(req, LogType.DATABASE_ERROR, err);
            res.status(StoreMessages.STORE_NOT_UPDATED.code).json(StoreMessages.STORE_NOT_UPDATED.response);
        })
    }).catch((err) => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
    });
}

export const getStore = (req: Request, res: Response) => {
    let storeID = req.params.id;
    ManagementDB.Stores.get(storeID).then((obj: any) => {
        res.send(obj);
    }).catch((err) => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
    });
}

export const deleteStore = (req: Request, res: Response) => {
    let storeID = req.params.id;
    ManagementDB.Stores.get(storeID).then(obj => {
        ManagementDB.Stores.remove(obj).then(() => {
            res.status(StoreMessages.STORE_DELETED.code).json(StoreMessages.STORE_DELETED.response);
        }).catch((err) => {
            createLog(req, LogType.DATABASE_ERROR, err);
            res.status(StoreMessages.STORE_NOT_DELETED.code).json(StoreMessages.STORE_NOT_DELETED.response);
        })
    }).catch((err) => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
    });
}

export const queryStores = (req: Request, res: Response) => {
    let qLimit = parseInt(req.query.limit) || 25;
    let qSkip = parseInt(req.query.skip) || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Stores.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch((err) => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.json({ ok: false, message: 'Grup Sorgusunda Hata!' });
    });
};