import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { TableMessages } from '../../utils/messages';
import { Table } from "../../models/store/table";
import { createReport } from "../../functions/store/reports";


////// /table [POST]
export const createTable = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        let TableWillCreate: Table = { db_name: 'tables', db_seq: 0, ...req.body };
        let Table = await StoresDB.post(TableWillCreate);
        TableWillCreate._id = Table.id;
        TableWillCreate._rev = Table.rev;
        let TableReport = { db_name: 'reports', db_seq: 0, ...createReport('Table', TableWillCreate) }
        const isCreated = await StoresDB.post(TableReport)
        if (isCreated && Table.ok) {
            res.status(TableMessages.TABLE_CREATED.code).json(TableMessages.TABLE_CREATED.response);
        } else {
            res.status(TableMessages.TABLE_NOT_CREATED.code).json(TableMessages.TABLE_NOT_CREATED.response);
        }
    } catch (error) {
        res.status(TableMessages.TABLE_NOT_CREATED.code).json(TableMessages.TABLE_NOT_CREATED.response);
    }
}


////// /table/:id [DELETE]
export const deleteTable = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Table = await StoresDB.get(req.params.id);
        const TableReport = await StoresDB.find({ selector: { db_name: 'reports', connection_id: Table._id } });
        StoresDB.remove(Table);
        StoresDB.remove(TableReport.docs[0]);
        res.status(TableMessages.TABLE_DELETED.code).json(TableMessages.TABLE_DELETED.response);
    } catch (error) {
        res.status(TableMessages.TABLE_NOT_DELETED.code).json(TableMessages.TABLE_NOT_DELETED.response);
    }

}

////// /table/:id [PUT]
export const updateTable = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Table = await StoresDB.get(req.params.id);
        await StoresDB.put({ Table, ...req.body });
        res.status(TableMessages.TABLE_CREATED.code).json(TableMessages.TABLE_CREATED.response);
    } catch (error) {
        res.status(TableMessages.TABLE_NOT_CREATED.code).json(TableMessages.TABLE_NOT_CREATED.response);
    }

}

////// /table/:id [GET]
export const getTable = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Table = await StoresDB.get(req.params.id);
        res.json(Table);
    } catch (error) {
        res.status(TableMessages.TABLE_NOT_CREATED.code).json(TableMessages.TABLE_NOT_CREATED.response);
    }
}


////// /tables + QueryString [GET]
export const queryTables = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Tables = await StoresDB.find({ selector: { db_name: 'tables', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Tables.docs);
    } catch (error) {
        res.status(TableMessages.TABLE_NOT_EXIST.code).json(TableMessages.TABLE_NOT_EXIST.response);
    }
}