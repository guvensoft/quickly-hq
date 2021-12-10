import { Request, Response } from "express";
import { DatabaseQueryLimit, ManagementDB } from "../../configrations/database";
import { Company } from "../../models/management/company";
import { createLog, LogType } from '../../utils/logger';
import { CompanyMessages } from "../../utils/messages";

//////  /company [POST]
export const createCompany = (req: Request, res: Response) => {
    let newCompany: Company = req.body;
    ManagementDB.Products.find({ selector: { name: newCompany.name } }).then(products => {
        if (products.docs.length > 0) {
            res.status(CompanyMessages.COMPANY_EXIST.code).json(CompanyMessages.COMPANY_EXIST.response);
        } else {
            newCompany.timestamp = Date.now();
            ManagementDB.Companies.post(newCompany).then(() => {
                res.status(CompanyMessages.COMPANY_CREATED.code).json(CompanyMessages.COMPANY_CREATED.response);
            }).catch((err) => {
                res.status(CompanyMessages.COMPANY_NOT_CREATED.code).json(CompanyMessages.COMPANY_NOT_CREATED.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            })
        }
    }).catch((err) => {
        res.status(CompanyMessages.COMPANY_NOT_CREATED.code).json(CompanyMessages.COMPANY_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /company/:id [PUT]
export const updateCompany = (req: Request, res: Response) => {
    let companyID = req.params.id;
    let formData = req.body;
    formData.timestamp = Date.now();
    ManagementDB.Companies.get(companyID).then(obj => {
        ManagementDB.Companies.put(Object.assign(obj, formData)).then(() => {
            res.status(CompanyMessages.COMPANY_UPDATED.code).json(CompanyMessages.COMPANY_UPDATED.response);
        }).catch((err) => {
            res.status(CompanyMessages.COMPANY_NOT_UPDATED.code).json(CompanyMessages.COMPANY_NOT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(CompanyMessages.COMPANY_NOT_EXIST.code).json(CompanyMessages.COMPANY_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /company/:id [GET]
export const getCompany = (req: Request, res: Response) => {
    let companyID = req.params.id;
    ManagementDB.Companies.get(companyID).then((obj: any) => {
        res.send(obj);
    }).catch((err) => {
        res.status(CompanyMessages.COMPANY_NOT_EXIST.code).json(CompanyMessages.COMPANY_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /company/:id [DELETE]
export const deleteCompany = (req: Request, res: Response) => {
    let companyID = req.params.id;
    ManagementDB.Companies.get(companyID).then(obj => {
        ManagementDB.Companies.remove(obj).then((isOk) => {
            res.status(CompanyMessages.COMPANY_DELETED.code).json(CompanyMessages.COMPANY_DELETED.response);
        }).catch((err) => {
            res.status(CompanyMessages.COMPANY_NOT_DELETED.code).json(CompanyMessages.COMPANY_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(CompanyMessages.COMPANY_NOT_EXIST.code).json(CompanyMessages.COMPANY_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /companies + QueryString [GET]
export const queryCompanies = (req: Request, res: Response) => {
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Companies.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch((err) => {
        res.status(CompanyMessages.COMPANY_NOT_EXIST.code).json(CompanyMessages.COMPANY_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};