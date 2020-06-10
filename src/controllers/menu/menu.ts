import { Request, Response } from "express";
import { StoreDB, RemoteDB, DatabaseQueryLimit, ManagementDB } from '../../configrations/database';
import { MenuMessages } from "../../utils/messages";



export const requestStore = async (req: Request, res: Response) => {




}

export const getOrder = async () => {

}


export const requestMenu = async (req: Request, res: Response) => {
    const StoreID = req.params.store;
    try {
        // const StoresDB = await StoreDB(StoreID);
        const Store = await ManagementDB.Stores.get(StoreID);
        const Database = await (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
        const Menu: any = await (await RemoteDB(Database, 'quickly-menu-app').find({ selector: { store_id: StoreID } })).docs[0];

        delete Store._id;
        delete Store._rev;
        delete Store.auth;
        delete Store.auth;
        delete Store.timestamp;
        delete Store.type;
        delete Store.status;

        delete Store.settings.order
        delete Store.settings.preorder
        delete Store.settings.reservation
        delete Store.settings.allowed_tables
        delete Store.settings.allowed_products

        delete Store.status;
        delete Store.category;
        delete Store.cuisine;
        delete Store.accounts;

        delete Menu._id;
        delete Menu._rev;

        delete Menu.documentType;
        delete Menu.restaurantId;
        delete Menu.location;

        res.json({ store: Store, menu: Menu });
    } catch (error) {
        console.log(error);
        res.status(MenuMessages.MENU_NOT_EXIST.code).json(MenuMessages.MENU_NOT_EXIST.response);
    }
}