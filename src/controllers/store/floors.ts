import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { FloorMessages } from '../../utils/messages';
import { Report } from "../../models/store/pos/report";


////// /floors/new [POST]
export const createFloor = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const FloorWillCreate = { db_name: 'floors', db_seq: 0, ...req.body };
        const Floor = await StoresDB.post(FloorWillCreate);
        // const FloorReport = new Report('floors', Floor.id, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], '', Date.now());
        // StoresDB.post(Object.assign(FloorReport, { db_name: 'reports', db_seq: 0 }));
        res.status(FloorMessages.FLOOR_CREATED.code).json(FloorMessages.FLOOR_CREATED.response);
    } catch (error) {
        res.status(FloorMessages.FLOOR_NOT_CREATED.code).json(FloorMessages.FLOOR_NOT_CREATED.response);
    }
}

////// /floors/id [DELETE]
export const deleteFloor = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Floor = await StoresDB.get(req.params.id);
        const FloorReport = await StoresDB.find({ selector: { db_name: 'reports', connection_id: Floor._id } });
        StoresDB.remove(Floor);
        StoresDB.remove(FloorReport.docs[0]);
        res.status(FloorMessages.FLOOR_DELETED.code).json(FloorMessages.FLOOR_DELETED.response);
    } catch (error) {
        res.status(FloorMessages.FLOOR_NOT_DELETED.code).json(FloorMessages.FLOOR_NOT_DELETED.response);
    }

}

////// /floors/id [PUT]
export const updateFloor = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Floor = await StoresDB.get(req.params.id);
        await StoresDB.put({ Floor, ...req.body });
        res.status(FloorMessages.FLOOR_CREATED.code).json(FloorMessages.FLOOR_CREATED.response);
    } catch (error) {
        res.status(FloorMessages.FLOOR_NOT_CREATED.code).json(FloorMessages.FLOOR_NOT_CREATED.response);
    }

}

////// /floors/id [GET]
export const getFloor = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Floor = await StoresDB.get(req.params.id);
        res.json(Floor);
    } catch (error) {
        res.status(FloorMessages.FLOOR_NOT_CREATED.code).json(FloorMessages.FLOOR_NOT_CREATED.response);
    }
}

////// /floors + QueryString [GET]
export const queryFloors = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Floors = await StoresDB.find({ selector: { db_name: 'floors', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Floors.docs);
    } catch (error) {
        res.status(FloorMessages.FLOOR_NOT_EXIST.code).json(FloorMessages.FLOOR_NOT_EXIST.response);
    }
}