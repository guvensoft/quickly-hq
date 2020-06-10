import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { MenuMessages } from '../../utils/messages';
import { Report } from "../../models/store/pos/report";


////// /menus/new [POST]
export const createMenu = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const MenuWillCreate = { db_name: 'menus', db_seq: 0, ...req.body };
        const Menu = await StoresDB.post(MenuWillCreate);
        // const MenuReport = new Report('Menu', Menu.id, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], req.body.name, Date.now());
        // StoresDB.post({ db_name: 'reports', db_seq: 0, ...MenuReport });
        res.status(MenuMessages.MENU_CREATED.code).json(MenuMessages.MENU_CREATED.response);
    } catch (error) {
        res.status(MenuMessages.MENU_NOT_CREATED.code).json(MenuMessages.MENU_NOT_CREATED.response);
    }
}


////// /menus/:id [DELETE]
export const deleteMenu = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Menu = await StoresDB.get(req.params.id);
        const MenuReport = await StoresDB.find({ selector: { db_name: 'reports', connection_id: Menu._id } });
        StoresDB.remove(Menu);
        StoresDB.remove(MenuReport.docs[0]);
        res.status(MenuMessages.MENU_DELETED.code).json(MenuMessages.MENU_DELETED.response);
    } catch (error) {
        res.status(MenuMessages.MENU_NOT_DELETED.code).json(MenuMessages.MENU_NOT_DELETED.response);
    }

}

////// /menus/:id [PUT]
export const updateMenu = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Menu = await StoresDB.get(req.params.id);
        await StoresDB.put({ Menu, ...req.body });
        res.status(MenuMessages.MENU_CREATED.code).json(MenuMessages.MENU_CREATED.response);
    } catch (error) {
        res.status(MenuMessages.MENU_NOT_CREATED.code).json(MenuMessages.MENU_NOT_CREATED.response);
    }

}

////// /menus/:id [GET]
export const getMenu = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Menu = await StoresDB.get(req.params.id);
        res.json(Menu);
    } catch (error) {
        res.status(MenuMessages.MENU_NOT_CREATED.code).json(MenuMessages.MENU_NOT_CREATED.response);
    }
}


////// /menus + QueryString [GET]
export const queryMenus = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Menus = await StoresDB.find({ selector: { db_name: 'menus', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Menus.docs);
    } catch (error) {
        res.status(MenuMessages.MENU_NOT_EXIST.code).json(MenuMessages.MENU_NOT_EXIST.response);
    }
}