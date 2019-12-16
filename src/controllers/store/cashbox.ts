import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { CashboxEntryMessages } from '../../utils/messages';

////// /cashbox/new [POST]
export const createCashboxEntry = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const CashboxEntryWillCreate = { db_name: 'cashbox', db_seq: 0, ...req.body };
        await StoresDB.post(CashboxEntryWillCreate);
        res.status(CashboxEntryMessages.ENTRY_CREATED.code).json(CashboxEntryMessages.ENTRY_CREATED.response);
    } catch (error) {
        res.status(CashboxEntryMessages.ENTRY_NOT_CREATED.code).json(CashboxEntryMessages.ENTRY_NOT_CREATED.response);
    }
}

////// /cashbox/id [DELETE]
export const deleteCashboxEntry = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const CashboxEntry = await StoresDB.get(req.params.id);
        StoresDB.remove(CashboxEntry);
        res.status(CashboxEntryMessages.ENTRY_DELETED.code).json(CashboxEntryMessages.ENTRY_DELETED.response);
    } catch (error) {
        res.status(CashboxEntryMessages.ENTRY_NOT_DELETED.code).json(CashboxEntryMessages.ENTRY_NOT_DELETED.response);
    }

}

////// /cashbox/id [PUT]
export const updateCashboxEntry = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const CashboxEntry = await StoresDB.get(req.params.id);
        await StoresDB.put({ CashboxEntry, ...req.body });
        res.status(CashboxEntryMessages.ENTRY_CREATED.code).json(CashboxEntryMessages.ENTRY_CREATED.response);
    } catch (error) {
        res.status(CashboxEntryMessages.ENTRY_NOT_CREATED.code).json(CashboxEntryMessages.ENTRY_NOT_CREATED.response);
    }
}

////// /cashbox/id [GET]
export const getCashboxEntry = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const CashboxEntry = await StoresDB.get(req.params.id);
        res.json(CashboxEntry);
    } catch (error) {
        res.status(CashboxEntryMessages.ENTRY_NOT_CREATED.code).json(CashboxEntryMessages.ENTRY_NOT_CREATED.response);
    }
}

////// /cashbox + QueryString [GET]
export const queryCashboxEntries = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoresDB = await StoreDB(StoreID);
        const CashboxEntrys = await StoresDB.find({ selector: { db_name: 'cashbox', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(CashboxEntrys.docs);
    } catch (error) {
        res.status(CashboxEntryMessages.ENTRY_NOT_EXIST.code).json(CashboxEntryMessages.ENTRY_NOT_EXIST.response);
    }
}