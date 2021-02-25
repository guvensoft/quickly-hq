import { Request, Response } from "express";
import { RemoteDB, ManagementDB, OrderDB, StoreDB } from '../../configrations/database';
import { MenuMessages } from "../../utils/messages";
import { Database } from "../../models/management/database";
import { writeFile } from 'fs';
import { cdnMenuPath } from '../../configrations/paths';
import { createLog, LogType } from "../../utils/logger";
import { Store } from "../../models/management/store";
import { Menu, OrderType, Receipt, User, ReceiptType, OrderStatus, ReceiptStatus } from "../../models/store/menu";
import { processPurchase } from "../../configrations/payments";
import { Check } from "../../models/store/check";

import axios from 'axios';


export const requestStore = async (req: Request, res: Response) => {

}

export const uploadPicture = async (req: Request, res: Response) => {
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

        delete Store.settings.order
        delete Store.settings.preorder
        delete Store.settings.reservation
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


export const requestMenuFromSlug = async (req: Request, res: Response) => {
    const Slug = req.params.slug;
    try {
        const Database: Database = await (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
        const Menu: Menu = await RemoteDB(Database, 'quickly-menu-app').get(Slug);
        const Store: Store = await ManagementDB.Stores.get(Menu.store_id);

        delete Store._id;
        delete Store._rev;
        delete Store.auth;
        delete Store.auth;
        delete Store.timestamp;
        delete Store.type;
        delete Store.status;

        delete Store.settings.allowed_tables
        delete Store.settings.allowed_products

        delete Store.status;
        delete Store.category;
        delete Store.cuisine;
        delete Store.accounts;

        delete Menu._id;
        delete Menu._rev;

        res.json({ store: Store, menu: Menu });
    } catch (error) {
        console.log(error);
        res.status(MenuMessages.MENU_NOT_EXIST.code).json(MenuMessages.MENU_NOT_EXIST.response);
    }
}


export const menuComment = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const FormData = req.body.comment;
    try {
        const sendComment = await (await StoreDB(StoreID)).post({ db_name: 'comments', ...FormData, timestamp: Date.now() });
        if (sendComment.ok) {
            res.json({ ok: true, message: 'Yorum Gönderildi' });
        }
    } catch (error) {
        res.json({ ok: false, message: 'Yorum İletilemedi Lütfen Tekrar Deneyiniz.' });
    }
}


export const checkRequest = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const Token = req.params.token;
    try {
        const orderRequestType = await (await StoreDB(StoreID)).get(Token);
        switch (orderRequestType.db_name) {
            case 'checks':
                let Check = orderRequestType;
                axios.get('http://localhost:3000/order/' + Token).then(ax_res => {
                    res.status(200).json({ ok: true, token: Token, type: OrderType.INSIDE });
                }).catch(async err => {
                    const inMemoryOrderDB = await OrderDB(StoreID, Token, true);
                    if (inMemoryOrderDB.name == Token) {
                        res.status(200).json({ ok: true, token: Token, type: OrderType.INSIDE, check: Check });
                    } else {
                        res.status(200).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' });
                    }
                });
                break;
            case 'customers':
                let Customer = orderRequestType;
                delete Customer._rev; delete Customer.db_name; delete Customer.db_seq; delete Customer.type, delete Customer._id;
                res.status(200).json({ ok: true, token: Token, type: OrderType.OUTSIDE, user: Customer });
                break;
            default:
                res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                break;
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
    }
}


export const payReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const Token: string = req.params.token;

    const Database = await OrderDB(StoreID, Token, false);
    const StoreDatabase = await StoreDB(StoreID);

    const CreditCard: { number: string, expiry: string, cvc: string, 'first-name': string, 'last-name': string } = req.body.card;
    try {
        const orderRequestType = await StoreDatabase.get(Token);
        switch (orderRequestType.db_name) {
            case 'checks':

                let Check: Check = orderRequestType;
                let Receipt: Receipt = req.body.receipt;
                let User: User = Receipt.user;

                let userItems = Receipt.orders.filter(order => order.status == OrderStatus.APPROVED);

                userItems.map(obj => {
                    obj.status = OrderStatus.PAYED;
                    return obj;
                })

                Receipt.status = ReceiptStatus.APPROVED;

                Database.bulkDocs(userItems).then(order_res => {
                    Database.put(Receipt).then(isOK => {
                        res.status(200).json({ ok: true, receipt: Receipt });
                    }).catch(err => {
                        console.log('Receipt Update Error on Payment Process', err);
                        res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                    })
                }).catch(err => {
                    console.log('Orders Update Error on Payment Process', err);
                    res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })

                })

                // TODO Delete items from Check to Payed

                // processPurchase(CreditCard.number, CreditCard.expiry.slice(2), CreditCard.expiry.slice(0, 2), CreditCard.cvc, Receipt.total.toString()).then(async success => {
                //     console.log(success.OrderId, Receipt.user.id);
                //     try {
                //         let Database = await OrderDB(StoreID, Token, false);
                //         console.log(Database.info())
                //         res.status(200).json({ ok: true, receipt: Receipt });

                //     } catch (error) {
                //         res.status(200).json({ ok: false, error: error });

                //     }
                // }).catch(err => {
                //     console.log(err)
                //     res.status(200).json({ ok: false, error: err });
                // })
                
                break;
            case 'customers':
                let Customer = orderRequestType;
                res.status(200).json({ ok: true, receipt: Receipt });
                break;
            default:
                res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                break;
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
    }
}