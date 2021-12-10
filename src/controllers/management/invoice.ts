import { Request, Response } from "express";
import { DatabaseQueryLimit, ManagementDB } from "../../configrations/database";
import { Invoice } from "../../models/management/invoice";
import { createLog, LogType } from '../../utils/logger';
import { InvoiceMessages } from "../../utils/messages";

//////  /invoice [POST]
export const createInvoice = (req: Request, res: Response) => {
    let newInvoice: Invoice = req.body;
    ManagementDB.Invoices.post(newInvoice).then(() => {
        res.status(InvoiceMessages.INVOICE_CREATED.code).json(InvoiceMessages.INVOICE_CREATED.response);
    }).catch((err) => {
        res.status(InvoiceMessages.INVOICE_NOT_CREATED.code).json(InvoiceMessages.INVOICE_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    })
};

//////  /invoice/:id [PUT]
export const updateInvoice = (req: Request, res: Response) => {
    let invoiceID = req.params.id;
    let formData = req.body;
    ManagementDB.Invoices.get(invoiceID).then(obj => {
        ManagementDB.Invoices.put(Object.assign(obj, formData)).then(() => {
            res.status(InvoiceMessages.INVOICE_UPDATED.code).json(InvoiceMessages.INVOICE_UPDATED.response);
        }).catch((err) => {
            res.status(InvoiceMessages.INVOICE_NOT_UPDATED.code).json(InvoiceMessages.INVOICE_NOT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(InvoiceMessages.INVOICE_NOT_EXIST.code).json(InvoiceMessages.INVOICE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /invoice/:id [GET]
export const getInvoice = (req: Request, res: Response) => {
    let invoiceID = req.params.id;
    ManagementDB.Invoices.get(invoiceID).then((obj: any) => {
        res.send(obj);
    }).catch((err) => {
        res.status(InvoiceMessages.INVOICE_NOT_EXIST.code).json(InvoiceMessages.INVOICE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /invoice/:id [DELETE]
export const deleteInvoice = (req: Request, res: Response) => {
    let userID = req.params.id;
    ManagementDB.Invoices.get(userID).then(obj => {
        ManagementDB.Invoices.remove(obj).then(() => {
            res.status(InvoiceMessages.INVOICE_DELETED.code).json(InvoiceMessages.INVOICE_DELETED.response);
        }).catch((err) => {
            res.status(InvoiceMessages.INVOICE_NOT_DELETED.code).json(InvoiceMessages.INVOICE_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(InvoiceMessages.INVOICE_NOT_EXIST.code).json(InvoiceMessages.INVOICE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /invoices + QueryString [GET]
export const queryInvoices = (req: Request, res: Response) => {
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Invoices.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch((err) => {
        res.status(InvoiceMessages.INVOICE_NOT_EXIST.code).json(InvoiceMessages.INVOICE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};