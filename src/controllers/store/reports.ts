import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { StoreDocumentMessages } from '../../utils/messages';
import { StoreReport, StoreSalesReport, ProductsReport, UsersReport, TablesReport } from "../../functions/store/reports";

////// /reports/products/ [GET]
export const getProductReports = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const startDate = req.params.start;
    const endDate = req.params.end;
    if (startDate) {
        if (endDate) {
            try {
                let durationReports = await StoreReport(StoreID, startDate, endDate);
                let productReports = ProductsReport(durationReports.find(obj => obj.database == 'closed_checks').docs);
                res.json(productReports);
            } catch (error) {
                res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
            }
        } else {
            try {
                let durationReports = await StoreReport(StoreID, startDate);
                let productReports = ProductsReport(durationReports.find(obj => obj.database == 'closed_checks').docs);
                res.json(productReports);
            } catch (error) {
                res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
            }
        }
    } else {
        try {
            const Database = await StoreDB(StoreID);
            const ProductReports = await Database.find({ selector: { db_name: 'reports', type: 'Product' }, limit: DatabaseQueryLimit })
            res.json(ProductReports.docs);
        } catch (error) {
            res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
        }
    }
}

////// /reports/tables/ [GET]
export const getTableReports = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const startDate = req.params.start;
    const endDate = req.params.end;
    if (startDate) {
        if (endDate) {
            try {
                let dayReports = await StoreReport(StoreID, startDate, endDate);
                let tablesResult = TablesReport(dayReports.find(obj => obj.database == 'closed_checks').docs);
                res.json(tablesResult);
            } catch (error) {
                res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
            }
        } else {
            try {
                let dayReports = await StoreReport(StoreID, startDate);
                let tablesResult = TablesReport(dayReports.find(obj => obj.database == 'closed_checks').docs);
                res.json(tablesResult);
            } catch (error) {
                res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
            }
        }
    } else {
        try {
            const Database = await StoreDB(StoreID);
            const TableReports = await Database.find({ selector: { db_name: 'reports', type: 'Table' }, limit: DatabaseQueryLimit })
            res.json(TableReports.docs);
        } catch (error) {
            res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
        }
    }
}

////// /reports/users/ [GET]
export const getUserReports = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const startDate = req.params.start;
    const endDate = req.params.end;
    if (startDate) {
        if (endDate) {
            try {
                let durationReports = await StoreReport(StoreID, startDate, endDate);
                let usersReports = UsersReport(durationReports.find(obj => obj.database == 'closed_checks').docs);
                res.json(usersReports);
            } catch (error) {
                res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
            }
        } else {
            try {
                let durationReports = await StoreReport(StoreID, startDate);
                let usersReports = UsersReport(durationReports.find(obj => obj.database == 'closed_checks').docs);
                res.json(usersReports);
            } catch (error) {
                res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
            }
        }
    } else {
        try {
            const Database = await StoreDB(StoreID);
            const UserReports = await Database.find({ selector: { db_name: 'reports', type: 'User' }, limit: DatabaseQueryLimit })
            res.json(UserReports.docs);
        } catch (error) {
            res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
        }
    }
}


////// /reports/sales/ [GET]
export const getSalesReports = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const startDate = req.params.start;
    const endDate = req.params.end;
    if (startDate) {
        if (endDate) {
            try {
                let dayReports = await StoreReport(StoreID, startDate, endDate);
                let salesResult = StoreSalesReport(dayReports.find(obj => obj.database == 'closed_checks').docs);
                res.json(salesResult);
            } catch (error) {
                console.log(error);
                res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
            }
        } else {
            try {
                let dayReports = await StoreReport(StoreID, startDate);
                let salesResult = StoreSalesReport(dayReports.find(obj => obj.database == 'closed_checks').docs);
                res.json(salesResult);
            } catch (error) {
                res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
            }
        }
    } else {
        try {
            const Database = await StoreDB(StoreID);
            const ActivityReports = await Database.find({ selector: { db_name: 'reports', type: 'Store' }, limit: DatabaseQueryLimit })
            res.json(ActivityReports.docs);
        } catch (error) {
            console.log(error);
            res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
        }

    }
}

////// /reports/activity/ [GET]
export const getActivityReports = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const startDate = req.params.start;
    const endDate = req.params.end;
    if (startDate) {
        if (endDate) {
            try {
                let dayReports = await StoreReport(StoreID, startDate, endDate);
                res.json(dayReports);
            } catch (error) {
                res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
            }
        } else {
            try {
                let dayReports = await StoreReport(StoreID, startDate);
                res.json(dayReports);
            } catch (error) {
                res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
            }
        }
    } else {
        try {
            const Database = await StoreDB(StoreID);
            const ActivityReports = await Database.find({ selector: { db_name: 'reports', type: 'Activity' }, limit: DatabaseQueryLimit })
            res.json(ActivityReports.docs);
        } catch (error) {
            res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
        }
    }
}


////// /reports/day/ [GET]
export const getDailyReports = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const startDate = req.params.start;
    const endDate = req.params.end;
    if (startDate) {
        if (endDate) {
            try {
                let dayReports = await StoreReport(StoreID, startDate, endDate);
                res.json(dayReports);
            } catch (error) {
                res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
            }
        } else {
            try {
                let dayReports = await StoreReport(StoreID, startDate);
                res.json(dayReports);
            } catch (error) {
                res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
            }
        }
    } else {
        try {
            const Database = await StoreDB(StoreID);
            const ActivityReports = await Database.find({ selector: { db_name: 'reports', type: 'Activity' }, limit: DatabaseQueryLimit })
            res.json(ActivityReports.docs);
        } catch (error) {
            res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
        }
    }
}