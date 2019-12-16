import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { StoreDocumentMessages } from '../../utils/messages';

////// /reports/products/ [GET]
export const getProductReports = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const Database = await StoreDB(StoreID);
        const ProductReports = await Database.find({ selector: { db_name: 'reports', type: 'Product' }, limit: DatabaseQueryLimit })
        res.json(ProductReports.docs);
    } catch (error) {
        res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
    }
}

////// /reports/tables/ [GET]
export const getTableReports = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const Database = await StoreDB(StoreID);
        const TableReports = await Database.find({ selector: { db_name: 'reports', type: 'Table' }, limit: DatabaseQueryLimit })
        res.json(TableReports.docs);
    } catch (error) {
        res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
    }
}

////// /reports/users/ [GET]
export const getUserReports = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const Database = await StoreDB(StoreID);
        const UserReports = await Database.find({ selector: { db_name: 'reports', type: 'User' }, limit: DatabaseQueryLimit })
        res.json(UserReports.docs);
    } catch (error) {
        res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
    }
}


////// /reports/sales/ [GET]
export const getSalesReports = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const Database = await StoreDB(StoreID);
        const ActivityReports = await Database.find({ selector: { db_name: 'reports', type: 'Store' }, limit: DatabaseQueryLimit })
        res.json(ActivityReports.docs);
    } catch (error) {
        res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
    }
}

////// /reports/activity/ [GET]
export const getActivityReports = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const Database = await StoreDB(StoreID);
        const ActivityReports = await Database.find({ selector: { db_name: 'reports', type: 'Activity' }, limit: DatabaseQueryLimit })
        res.json(ActivityReports.docs);
    } catch (error) {
        res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
    }
}