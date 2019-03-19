import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ManagementDB } from "../../configrations/database";
import { Store } from "../../models/social/stores";
import { createLog, LogType } from '../../utils/logger';
import { StoreMessages } from "../../utils/messages";


export const createStore = (req: Request, res: Response) => {
    let newStore: Store = req.body;
    ManagementDB.Stores.find({ selector: { name: newStore.name } }).then(stores => {
        if (stores.docs.length > 0) {
            res.status(StoreMessages.STORE_EXIST.code).json(StoreMessages.STORE_EXIST.response);
        } else {
            newStore.timestamp = Date.now();
            newStore.auth.database_user = bcrypt.genSaltSync();
            newStore.auth.database_password = bcrypt.hashSync(newStore.auth.database_name, bcrypt.genSaltSync());
            ManagementDB.Stores.post(newStore).then(db_res => {
                res.status(StoreMessages.STORE_CREATED.code).json(StoreMessages.STORE_CREATED.response);
            }).catch((err) => {
                res.status(StoreMessages.STORE_NOT_CREATED.code).json(StoreMessages.STORE_NOT_CREATED.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            })
        }
    }).catch((err) => {
        res.status(StoreMessages.STORE_NOT_CREATED.code).json(StoreMessages.STORE_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

export const updateStore = (req: Request, res: Response) => {
    let storeID = req.params.id;
    let formData = req.body;
    ManagementDB.Stores.get(storeID).then(store => {
        ManagementDB.Stores.put(Object.assign(store, formData)).then(db_res => {
            res.status(StoreMessages.STORE_UPDATED.code).json(StoreMessages.STORE_UPDATED.response);
        }).catch((err) => {
            res.status(StoreMessages.STORE_NOT_UPDATED.code).json(StoreMessages.STORE_NOT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

export const getStore = (req: Request, res: Response) => {
    let storeID = req.params.id;
    ManagementDB.Stores.get(storeID).then((obj: any) => {
        res.send(obj);
    }).catch((err) => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

export const deleteStore = (req: Request, res: Response) => {
    let storeID = req.params.id;
    ManagementDB.Stores.get(storeID).then(obj => {
        ManagementDB.Stores.remove(obj).then(() => {
            res.status(StoreMessages.STORE_DELETED.code).json(StoreMessages.STORE_DELETED.response);
        }).catch((err) => {
            res.status(StoreMessages.STORE_NOT_DELETED.code).json(StoreMessages.STORE_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

export const queryStores = (req: Request, res: Response) => {
    let qLimit = req.query.limit || 25;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Stores.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch((err) => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};