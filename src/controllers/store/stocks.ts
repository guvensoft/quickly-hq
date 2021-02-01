
import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { StockMessages } from '../../utils/messages';
import { Report } from "../../models/store/report";

////// /stocks/new [POST]
export const createStock = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const StockWillCreate = { db_name: 'stocks', db_seq: 0, ...req.body };
        const Stock = await StoresDB.post(StockWillCreate);
        // const StockReport = new Report('stocks', Stock.id, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], '', Date.now());
        // StoresDB.post({ db_name: 'reports', db_seq: 0, ...StockReport });
        res.status(StockMessages.STOCK_CREATED.code).json(StockMessages.STOCK_CREATED.response);
    } catch (error) {
        res.status(StockMessages.STOCK_NOT_CREATED.code).json(StockMessages.STOCK_NOT_CREATED.response);
    }
}


////// /stocks/id [DELETE]
export const deleteStock = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Stock = await StoresDB.get(req.params.id);
        const StockReport = await StoresDB.find({ selector: { db_name: 'reports', connection_id: Stock._id } });
        StoresDB.remove(Stock);
        StoresDB.remove(StockReport.docs[0]);
        res.status(StockMessages.STOCK_DELETED.code).json(StockMessages.STOCK_DELETED.response);
    } catch (error) {
        res.status(StockMessages.STOCK_NOT_DELETED.code).json(StockMessages.STOCK_NOT_DELETED.response);
    }

}

////// /stocks/id [PUT]
export const updateStock = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Stock = await StoresDB.get(req.params.id);
        await StoresDB.put({ Stock, ...req.body });
        res.status(StockMessages.STOCK_CREATED.code).json(StockMessages.STOCK_CREATED.response);
    } catch (error) {
        res.status(StockMessages.STOCK_NOT_CREATED.code).json(StockMessages.STOCK_NOT_CREATED.response);
    }

}

////// /stocks/id [GET]
export const getStock = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Stock = await StoresDB.get(req.params.id);
        res.json(Stock);
    } catch (error) {
        res.status(StockMessages.STOCK_NOT_CREATED.code).json(StockMessages.STOCK_NOT_CREATED.response);
    }
}


////// /stocks + QueryString [GET]
export const queryStocks = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Stocks = await StoresDB.find({ selector: { db_name: 'stocks', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Stocks.docs);
    } catch (error) {
        res.status(StockMessages.STOCK_NOT_EXIST.code).json(StockMessages.STOCK_NOT_EXIST.response);
    }
}