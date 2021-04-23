import { Request, Response } from "express";
import { RemoteDB, ManagementDB, OrderDB, StoreDB } from '../../configrations/database';
import { MenuMessages } from "../../utils/messages";
import { Database } from "../../models/management/database";
import { writeFile } from 'fs';
import { cdnMenuPath } from '../../configrations/paths';
import { createLog, LogType } from "../../utils/logger";
import { Store } from "../../models/management/store";
import { Menu, OrderType, Receipt, User, ReceiptType, OrderStatus, ReceiptStatus, Order } from "../../models/store/menu";
import { processPurchase } from "../../configrations/payments";
import { Check, CheckProduct, PaymentStatus } from "../../models/store/check";

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


export const acceptOrder = (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const Token: string = req.params.token;

    let Order: Order = req.body.order;

    Order.status = OrderStatus.PREPARING;
    // this.mainService.updateData('orders', order._id, { status: OrderStatus.PREPARING }).then(res => {
    //     console.log(res);
    // }).catch(err => {
    //     console.log(err);
    // })
}

export const approoveOrder = (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const Token: string = req.params.token;

    let Order: Order = req.body.order;

    Order.status = 2;

    let approveTime = Date.now();
    // this.mainService.changeData('checks', order.check, (check: Check) => {
    //     order.items.forEach(orderItem => {
    //         let mappedProduct = this.products.find(product => product._id == orderItem.product_id || product.name == orderItem.name);
    //         let newProduct = new CheckProduct(mappedProduct._id, mappedProduct.cat_id, mappedProduct.name + (orderItem.type ? ' ' + orderItem.type : ''), orderItem.price, orderItem.note, 2, this.ownerId, approveTime, mappedProduct.tax_value, mappedProduct.barcode);
    //         check.total_price = check.total_price + newProduct.price;
    //         check.products.push(newProduct);
    //     })
    //     return check;
    // }).then(isOk => {
    //     this.mainService.updateData('orders', order._id, { status: OrderStatus.APPROVED, timestamp: approveTime }).then(res => {
    //         // console.log(res);
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // }).catch(err => {
    //     console.log(err);
    // })
}

export const cancelOrder = (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const Token: string = req.params.token;

    let Order: Order = req.body.order;

    Order.status = 3;
    // this.mainService.updateData('orders', order._id, { status: OrderStatus.CANCELED }).then(res => {
    //     console.log(res);
    // }).catch(err => {
    //     console.log(err);
    // })
}


export const payReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const Token: string = req.params.token;

    let Receipt: Receipt = req.body.receipt;

    const StoreDatabase = await StoreDB(StoreID);

    const CreditCard: { number: string, expiry: string, cvc: string, 'first-name': string, 'last-name': string } = req.body.card;
    try {
        const orderRequestType = await StoreDatabase.get(Token);
        switch (orderRequestType.db_name) {
            case 'checks':
                const Database = await OrderDB(StoreID, Token, false);

                let Check: Check = orderRequestType;
                let User: User = Receipt.user;

                let userItems = Receipt.orders.filter(order => order.status == OrderStatus.APPROVED);

                userItems.map(obj => {
                    obj.status = OrderStatus.PAYED;
                    return obj;
                })

                /////////// Check Operations ////////////
                let productsWillPay: Array<CheckProduct> = Check.products.filter(product => userItems.map(obj => obj.timestamp).includes(product.timestamp));
                const newPayment: PaymentStatus = { owner: User.name, method: 'Kart', amount: Receipt.total, discount: Receipt.discount, timestamp: Date.now(), payed_products: productsWillPay };
                if (Check.payment_flow == undefined) {
                    Check.payment_flow = [];
                }
                Check.payment_flow.push(newPayment);
                Check.discount += newPayment.amount;
                Check.products = Check.products.filter(product => !productsWillPay.includes(product));
                Check.total_price = Check.products.map(product => product.price).reduce((a, b) => a + b, 0);

                /////////// Check Operations ////////////

                Receipt.status = ReceiptStatus.APPROVED;
                Database.bulkDocs(userItems).then(order_res => {
                    Database.put(Receipt).then(isOK => {
                        StoreDatabase.put(Check).then(isCheckUpdated => {
                            if (isCheckUpdated.ok) {
                                res.status(200).json({ ok: true, receipt: Receipt });
                            }
                        }).catch(err => {
                            console.log('Check Update Error on Payment Process', err);
                            res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                        })
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
                Receipt.status = ReceiptStatus.APPROVED;
                Receipt.orders[0].status = OrderStatus.APPROVED;
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