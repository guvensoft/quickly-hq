import { Response, Request } from "express";
import { ManagementDB, DatabaseQueryLimit } from "../../configrations/database";
import { SupplierMessages } from '../../utils/messages';
import { createLog, LogType } from '../../utils/logger';
import { Supplier } from "../../models/management/supplier";


//////  /supplier [POST]
export const createSupplier = (req: Request, res: Response) => {
    let newSupplier: Supplier = req.body;
    ManagementDB.Suppliers.find({ selector: { name: newSupplier.name } }).then(stores => {
        if (stores.docs.length > 0) {
            res.status(SupplierMessages.SUPPLIER_EXIST.code).json(SupplierMessages.SUPPLIER_EXIST.response);
        } else {
            newSupplier.timestamp = Date.now();
            ManagementDB.Suppliers.post(newSupplier).then(db_res => {
                res.status(SupplierMessages.SUPPLIER_CREATED.code).json(SupplierMessages.SUPPLIER_CREATED.response);
            }).catch((err) => {
                res.status(SupplierMessages.SUPPLIER_NOT_CREATED.code).json(SupplierMessages.SUPPLIER_NOT_CREATED.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            })
        }
    }).catch((err) => {
        res.status(SupplierMessages.SUPPLIER_NOT_CREATED.code).json(SupplierMessages.SUPPLIER_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /supplier/:id [PUT]
export const updateSupplier = (req: Request, res: Response) => {
    let supplierID = req.params.id;
    let formData = req.body;
    ManagementDB.Suppliers.get(supplierID).then(obj => {
        ManagementDB.Suppliers.put(Object.assign(obj, formData)).then(() => {
            res.status(SupplierMessages.SUPPLIER_UPDATED.code).json(SupplierMessages.SUPPLIER_UPDATED.response);
        }).catch(err => {
            res.status(SupplierMessages.SUPPLIER_NOT_UPDATED.code).json(SupplierMessages.SUPPLIER_NOT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(SupplierMessages.SUPPLIER_NOT_EXIST.code).json(SupplierMessages.SUPPLIER_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /supplier/:id [GET]
export const getSupplier = (req: Request, res: Response) => {
    let supplierID = req.params.id;
    ManagementDB.Suppliers.get(supplierID).then((obj: any) => {
        res.send(obj);
    }).catch(err => {
        res.status(SupplierMessages.SUPPLIER_NOT_EXIST.code).json(SupplierMessages.SUPPLIER_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /supplier/:id [DELETE]
export const deleteSupplier = (req: Request, res: Response) => {
    let supplierID = req.params.id;
    ManagementDB.Suppliers.get(supplierID).then(obj => {
        ManagementDB.Suppliers.remove(obj).then(() => {
            res.status(SupplierMessages.SUPPLIER_DELETED.code).json(SupplierMessages.SUPPLIER_DELETED.response);
        }).catch(err => {
            res.status(SupplierMessages.SUPPLIER_NOT_DELETED.code).json(SupplierMessages.SUPPLIER_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(SupplierMessages.SUPPLIER_NOT_EXIST.code).json(SupplierMessages.SUPPLIER_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /suppliers + QueryString [GET]
export const querySuppliers = (req: Request, res: Response) => {
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Suppliers.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        res.status(SupplierMessages.SUPPLIER_NOT_EXIST.code).json(SupplierMessages.SUPPLIER_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};