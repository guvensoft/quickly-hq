import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit, ManagementDB, RemoteDB } from '../../configrations/database';
import { MenuMessages } from '../../utils/messages';

import { Database } from "../../models/management/database";
import { writeFile } from 'fs';
import { cdnMenuPath } from '../../configrations/paths';
import { createLog, LogType } from "../../utils/logger";
import { Store } from "../../models/management/store";
import { Menu, OrderType, Receipt, User, ReceiptType, OrderStatus, ReceiptStatus, Order } from "../../models/store/menu";


export const requestMenu = async (req: Request, res: Response) => {
    const StoreID = req.params.store;
    try {
        const Store: Store = await ManagementDB.Stores.get(StoreID);
        const Database: Database = await ManagementDB.Databases.get(Store.auth.database_id);
        const Menu: Menu = await (await RemoteDB(Database, 'quickly-menu-app').find({ selector: { store_id: StoreID } })).docs[0];

        delete Store._id;
        delete Store._rev;
        delete Store.auth;
        delete Store.auth;
        delete Store.timestamp;
        delete Store.type;
        delete Store.status;

        // delete Store.settings.order
        // delete Store.settings.preorder
        // delete Store.settings.reservation
        delete Store.settings.allowed_tables
        delete Store.settings.allowed_products

        delete Store.status;
        delete Store.category;
        delete Store.cuisine;
        delete Store.accounts;

        res.json({ store: Store, menu: Menu });
    } catch (error) {
        console.log(error);
        res.status(MenuMessages.MENU_NOT_EXIST.code).json(MenuMessages.MENU_NOT_EXIST.response);
    }
}

export const saveMenu = async (req: Request, res: Response) => {
    const StoreID = req.params.store;
    let MenuDoc = req.body.menu;
    try {
        const Store = await ManagementDB.Stores.get(StoreID);
        const Database: Database = await ManagementDB.Databases.get(Store.auth.database_id);
        const UpdateMenu = await RemoteDB(Database, 'quickly-menu-app').put(MenuDoc);
        if (UpdateMenu.ok) {
            MenuDoc._rev = UpdateMenu.rev;
            res.status(MenuMessages.MENU_UPDATED.code).json({ ok: true, menu: MenuDoc });
        }
    } catch (error) {
        console.log(error);
        res.status(MenuMessages.MENU_NOT_UPDATED.code).json(MenuMessages.MENU_NOT_UPDATED.response);
    }
}

export const uploadPicture = async (req: Request, res: Response) => {
    const StoreID = req.params.store;

    const Slug: string = req.body.slug;
    const Picture: string = req.body.picture;
    const PictureName: string = req.body.name;
    const PictureType: 'product' | 'category' | 'promotion' = req.body.type;

    let uploadFolder = PictureType == 'product' ? 'urun' : PictureType == 'category' ? 'kategori' : PictureType == 'promotion' ? 'kampanya' : '';
    let relativePath = `/${uploadFolder}/${PictureName}.jpg`;

    writeFile(cdnMenuPath + Slug + relativePath, Picture, 'base64', (err) => {
        if (!err) {
            res.status(200).json({ ok: true, path: relativePath });
        } else {
            res.status(500).json({ ok: false, message: 'Resim Yüklenirken Hata Oluştu! Tekrar Deneyin.' });
            createLog(req, LogType.INNER_LIBRARY_ERROR, err.message);
        }
    });
}

