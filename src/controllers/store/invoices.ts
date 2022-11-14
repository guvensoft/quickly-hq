import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit, ManagementDB, StoresDB } from '../../configrations/database';
import { CategoryMessages } from '../../utils/messages';
import { Category, SubCategory } from "../../models/store/product";
import { createReport } from "../../functions/store/reports";


////// /invoice/id [GET]
export const getInvoice = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const InvoiceID = req.params.id;
    try {
        // const StoresDB = await StoreDB(StoreID);
        let invoice = (await StoresDB.Invoices.get(InvoiceID))
        res.json(invoice);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
    }
}



//// /invoices + QueryString [GET]
export const queryInvoices = async (req: Request, res: Response) => {
    const StoreID  = req.headers.store.toString();
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        // const Store = await ManagementDB.Stores.get(StoreID);
        let invoices = (await StoresDB.Invoices.find({selector:{ store: StoreID }})).docs
        res.json(invoices);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
    }
}