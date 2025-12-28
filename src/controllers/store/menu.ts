import { Request, Response } from "express";
import { DatabaseQueryLimit, ManagementDB, RemoteDB, StoreDB } from '../../configrations/database';
import { MenuMessages } from '../../utils/messages';

import { writeFile } from 'fs';
import { CDN_MENU_PATH } from '../../configrations/paths';
import { createReport } from "../../functions/store/reports";
import { Database } from "../../models/management/database";
import { Store } from "../../models/management/store";
import { Menu } from "../../models/store/menu";
import { Product, ProductSpecs, SubCategory } from "../../models/store/product";
import { createLog, LogType } from "../../utils/logger";


export const requestMenu = async (req: Request, res: Response) => {
    const StoreID = req.params.store;
    try {
        const Store: Store = await ManagementDB.Stores.get(StoreID);
        const Database: Database = await ManagementDB.Databases.get(Store.auth.database_id);
        const Menu: Menu = await (await RemoteDB(Database, 'quickly-menu-app').find({ selector: { store_id: StoreID } })).docs[0];

        // const Menu: Menu = (await MenuDB.Memory.find({ selector: { store_id: StoreID } })).docs[0];


        delete Store._id;
        delete Store._rev;
        delete Store.auth;
        delete Store.auth;
        delete Store.timestamp;
        delete Store.type;
        delete Store.status;
        delete Store.supervisory;
        delete Store.notes;
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
    let MenuDoc:Menu = req.body.menu;
    try {
        const Store = await ManagementDB.Stores.get(StoreID);
        const Database: Database = await ManagementDB.Databases.get(Store.auth.database_id);
        MenuDoc.timestamp = Date.now();
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

    writeFile(CDN_MENU_PATH + Slug + relativePath, Picture, 'base64', (err) => {
        if (!err) {
            res.status(200).json({ ok: true, path: relativePath });
        } else {
            res.status(500).json({ ok: false, message: 'Resim Yüklenirken Hata Oluştu! Tekrar Deneyin.' });
            createLog(req, LogType.INNER_LIBRARY_ERROR, err.message);
        }
    });
}

export const menuToTerminal = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const Database:Database = (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
        const StoreDatabase = await StoreDB(StoreID);
        const MenuDatabase = RemoteDB(Database, 'quickly-menu-app');

        const Menu: Menu = await (await MenuDatabase.find({ selector: { store_id: StoreID } })).docs[0];
        let selectedCategories = Menu.categories // .filter(obj => obj.name == 'Kokteyller / Cocktails');
        selectedCategories.forEach((category, index) => {
            let newCategory: any = { name: category.name, description: '', status: 0, order: index, tags: '', printer: 'Bar' }
            StoreDatabase.post({ db_name: 'categories', ...newCategory }).then(cat_res => {
                console.log('+ Kategori Eklendi', newCategory.name);
                category.id = cat_res.id;
                if (category.item_groups.length > 0) {
                    category.item_groups.forEach(sub_cat => {
                        let newSubCategory: SubCategory = { name: sub_cat.name, description: '', status: 0, cat_id: cat_res.id }
                        StoreDatabase.post({ db_name: 'sub_categories', ...newSubCategory }).then(sub_cat_res => {
                            sub_cat.id = sub_cat_res.id;
                            console.log('+ Alt Kategori Eklendi', newCategory.name);
                            sub_cat.items.forEach(item => {
                                if (!item.options || item.options.length == 0) {
                                    let newProduct: Product = { name: item.name, description: item.description, type: 1, status: 0, price: parseInt(item.price.toString()), barcode: 0, notes: null, specifies: [], cat_id: cat_res.id, subcat_id: sub_cat_res.id, tax_value: 8, }
                                    StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                        item.product_id = product_res.id;
                                        console.log('+ Ürün Eklendi', newCategory.name);

                                        /////////////////////////////////////////////////////////////
                                        ////////////////////      Report    /////////////////////////
                                        newProduct._id = product_res.id;
                                        newProduct._rev = product_res.rev;
                                        let newReport = createReport('Product', newProduct);
                                        StoreDatabase.post(newReport).then(res => {
                                            console.log('+ Rapor Eklendi', newReport.description);
                                        }).catch(err => {
                                            console.log('Rapor Hatası', newReport.description)
                                        })
                                        /////////////////////////////////////////////////////////////
                                    }).catch(err => {
                                        console.log('Ürün Hatası', item.name)
                                    })
                                } else {
                                    let specs: Array<ProductSpecs> = [];
                                    item.options.forEach(opts => {
                                        let spec: ProductSpecs = {
                                            spec_name: opts.name,
                                            spec_price: parseInt(opts.price.toString())
                                        }
                                        specs.push(spec);
                                    })
                                    let newProduct: Product = { name: item.name, description: item.description, type: 1, status: 0, price: specs[0].spec_price, barcode: 0, notes: null, specifies: specs, cat_id: cat_res.id, subcat_id: sub_cat_res.id, tax_value: 8, }
                                    StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                        console.log('+ Ürün Eklendi', newCategory.name);

                                        item.product_id = product_res.id;

                                        /////////////////////////////////////////////////////////////
                                        ////////////////////      Report    /////////////////////////
                                        newProduct._id = product_res.id;
                                        newProduct._rev = product_res.rev;
                                        let newReport = createReport('Product', newProduct);
                                        StoreDatabase.post(newReport).then(res => {
                                            console.log('+ Rapor Eklendi', newReport.description);
                                        }).catch(err => {
                                            console.log('Rapor Hatası', newReport.description)
                                        })
                                        /////////////////////////////////////////////////////////////
                                    }).catch(err => {
                                        console.log('Ürün Hatası', item.name)
                                    })
                                }
                            })
                        }).catch(err => {
                            console.log('Alt Kategori Hatası', category.name)
                        });
                    });
                } else {
                    category.items.forEach(item => {
                        if (!item.options || item.options.length == 0) {
                            let newProduct: any = { name: item.name, description: item.description, type: 0, status: 0, price: parseInt(item.price.toString()), barcode: 0, notes: null, specifies: [], cat_id: cat_res.id, tax_value: 8, }
                            StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                console.log('+ Ürün Eklendi', newCategory.name);
                                item.product_id = product_res.id;
                                /////////////////////////////////////////////////////////////
                                ////////////////////      Report    /////////////////////////
                                newProduct._id = product_res.id;
                                newProduct._rev = product_res.rev;
                                let newReport = createReport('Product', newProduct);
                                StoreDatabase.post(newReport).then(res => {
                                    console.log('+ Rapor Eklendi', newReport.description);
                                }).catch(err => {
                                    console.log('Rapor Hatası', newReport.description)
                                })
                                /////////////////////////////////////////////////////////////

                            }).catch(err => {
                                console.log('Ürün Hatası', item.name)
                            })
                        } else {
                            let specs: Array<ProductSpecs> = [];
                            item.options.forEach(opts => {
                                let spec: ProductSpecs = {
                                    spec_name: opts.name,
                                    spec_price: parseInt(opts.price.toString())
                                }
                                specs.push(spec);
                            })
                            let newProduct: Product = { name: item.name, description: item.description, type: 0, status: 0, price: specs[0].spec_price, barcode: 0, notes: null, specifies: specs, cat_id: cat_res.id, tax_value: 8, }
                            StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                console.log('+ Ürün Eklendi', newCategory.name);
                                item.product_id = product_res.id;
                                /////////////////////////////////////////////////////////////
                                ////////////////////      Report    /////////////////////////
                                newProduct._id = product_res.id;
                                newProduct._rev = product_res.rev;
                                let newReport = createReport('Product', newProduct);
                                StoreDatabase.post(newReport).then(res => {
                                    console.log('+ Rapor Eklendi', newReport.description);
                                }).catch(err => {
                                    console.log('Rapor Hatası', newReport.description)
                                })
                                /////////////////////////////////////////////////////////////
                            }).catch(err => {
                                console.log('Ürün Hatası', item.name)
                            })
                        }
                    })
                }
            }).catch(err => {
                console.log('Kategori Hatası', category.name)
            })
        })
    } catch (error) {
        console.log(error);
    }

}

export const updateTerminalWithMenu = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const Database: Database = (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
        const StoreDatabase = await StoreDB(StoreID);
        const MenuDatabase = RemoteDB(Database, 'quickly-menu-app');

        const StoreProducts: Array<Product> = (await StoreDatabase.find({ selector: { db_name: 'products' }, limit: DatabaseQueryLimit })).docs;
        const Menu: Menu = await (await MenuDatabase.find({ selector: { store_id: StoreID } })).docs[0];
        
        let BulkUpdateDocs: Array<Product> = [];

        let selectedCategories = Menu.categories;

        selectedCategories.forEach((category, index) => {
            if (category.items.length > 0) {
                category.items.forEach(obj => {
                    let product = StoreProducts.find(product => product._id == obj.product_id);
                    if (product) {
                        product.price = obj.price;
                        if (obj?.options && obj?.options.length > 0) {
                            if (product?.specifies) {
                                product.specifies = [];
                                obj.options.forEach(opt => {
                                    product.specifies.push({ spec_name: opt.name, spec_price: opt.price });
                                })
                            } else {
                                product.specifies = [];
                                obj.options.forEach(opt => {
                                    product.specifies.push({ spec_name: opt.name, spec_price: opt.price });
                                })
                            }
                        }else{
                            product.specifies = [];
                        }
                        BulkUpdateDocs.push(product);
                    } else {
                        console.log('newProduct', obj.name, obj.price);
                        // if(obj?.options && obj?.options.length > 0){
                        //     if(product?.specifies){
                        //         product.specifies = [];
                        //         obj.options.forEach(opt => {
                        //             product.specifies.push({spec_name:opt.name,spec_price:opt.price});
                        //         })
                        //     }else{
                        //         product.specifies = [];
                        //         obj.options.forEach(opt => {
                        //             product.specifies.push({spec_name:opt.name,spec_price:opt.price});
                        //         })
                        //     }
                        // }
                    }
                })
            }
            if (category.item_groups.length > 0) {
                category.item_groups.forEach(sub_cat => {
                    if (sub_cat.items.length > 0) {
                        sub_cat.items.forEach(obj => {
                            let product = StoreProducts.find(product => product._id == obj.product_id);
                            if (product) {
                                product.price = obj.price;
                                if (obj?.options && obj?.options.length > 0) {
                                    if (product?.specifies) {
                                        product.specifies = [];
                                        obj.options.forEach(opt => {
                                            product.specifies.push({ spec_name: opt.name, spec_price: opt.price });
                                        })
                                    } else {
                                        product.specifies = [];
                                        obj.options.forEach(opt => {
                                            product.specifies.push({ spec_name: opt.name, spec_price: opt.price });
                                        })
                                    }
                                }else{
                                    product.specifies = [];
                                }
                                BulkUpdateDocs.push(product);
                            } else {
                                console.log('newProduct', obj.name, obj.price);
                                // if(obj?.options && obj?.options.length > 0){

                                // }
                            }
                        })
                    }
                });
            }
        })
        console.log(BulkUpdateDocs.length, ' Waiting Docs To Update or Create');
        let updateOps = await StoreDatabase.bulkDocs(BulkUpdateDocs);
        console.log(updateOps);
    } catch (error) {
        console.log(error);
    }
}
