import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import fetch from "node-fetch";
import request from 'request';
import { ManagementDB } from "../../databases/management";
import { Store } from "../../models/social/stores";
import { createLog, LogType } from '../../utils/logger';
import { StoreMessages } from "../../utils/messages";


export const createStore = (req: Request, res: Response) => {
    let newStore: Store = req.body;
    ManagementDB.Stores.find({ selector: { name: newStore.name } }).then(stores => {
        if (stores.docs.length > 0) {
            res.status(StoreMessages.STORE_EXIST.code).json(StoreMessages.STORE_EXIST.response);
        } else {
            newStore.timestamp = Date.now();
            newStore.auth.database_user = bcrypt.genSaltSync();
            newStore.auth.database_password = bcrypt.hashSync(newStore.auth.database_name, bcrypt.genSaltSync());
            ManagementDB.Stores.post(newStore).then(db_res => {
                res.status(StoreMessages.STORE_CREATED.code).json(StoreMessages.STORE_CREATED.response);
            }).catch((err) => {
                res.status(StoreMessages.STORE_NOT_CREATED.code).json(StoreMessages.STORE_NOT_CREATED.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            })
        }
    }).catch((err) => {
        res.status(StoreMessages.STORE_NOT_CREATED.code).json(StoreMessages.STORE_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

export const updateStore = (req: Request, res: Response) => {
    let storeID = req.params.id;
    let formData = req.body;
    ManagementDB.Stores.get(storeID).then(store => {
        ManagementDB.Stores.put(Object.assign(store, formData)).then(db_res => {
            res.status(StoreMessages.STORE_UPDATED.code).json(StoreMessages.STORE_UPDATED.response);
        }).catch((err) => {
            res.status(StoreMessages.STORE_NOT_UPDATED.code).json(StoreMessages.STORE_NOT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

export const getStore = (req: Request, res: Response) => {
    let storeID = req.params.id;
    ManagementDB.Stores.get(storeID).then((obj: any) => {
        res.send(obj);
    }).catch((err) => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

export const deleteStore = (req: Request, res: Response) => {
    let storeID = req.params.id;
    ManagementDB.Stores.get(storeID).then(obj => {
        ManagementDB.Stores.remove(obj).then(() => {
            res.status(StoreMessages.STORE_DELETED.code).json(StoreMessages.STORE_DELETED.response);
        }).catch((err) => {
            res.status(StoreMessages.STORE_NOT_DELETED.code).json(StoreMessages.STORE_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

export const queryStores = (req: Request, res: Response) => {
    let qLimit = parseInt(req.query.limit) || 25;
    let qSkip = parseInt(req.query.skip) || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Stores.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch((err) => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

export const getImage = (req: Request, res: Response) => {

    // q={searchTerms}
    // num={count?}
    // start={startIndex?}
    // lr={language?}
    // safe={safe?}
    // cx={cx?}
    // sort={sort?}
    // filter={filter?}
    // gl={gl?}
    // cr={cr?}
    // googlehost={googleHost?}
    // c2coff={disableCnTwTranslation?}
    // hq={hq?}
    // hl={hl?}
    // siteSearch={siteSearch?}
    // siteSearchFilter={siteSearchFilter?}

    // exactTerms={exactTerms?}
    // excludeTerms={excludeTerms?}
    // linkSite={linkSite?}
    // orTerms={orTerms?}
    // relatedSite={relatedSite?}
    // dateRestrict={dateRestrict?}
    // lowRange={lowRange?}
    // highRange={highRange?}
    // searchType={searchType}
    // fileType={fileType?}
    // rights={rights?}
    // imgSize={imgSize?}
    // imgType={imgType?}
    // imgColorType={imgColorType?}
    // imgDominantColor={imgDominantColor?}

    let text: string = req.params.text.toLowerCase().replace(' ', '+').replace('ı', 'i').replace('ş', 's').replace('ğ', 'g').replace('ö', 'o').replace('ç', 'c');
    text = encodeURI(text);
    const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyARrB06rfYxEDUjqPlrQcPt0SilKXiooOQ&cx=007294214063143114304:5yl4tp9fpvo&q=${text}&searchType=image&fileType=png,jpg&lr=lang_tr&imgSize=xxlarge`;
    fetch(url).then(g_res => {
        g_res.json().then((j_res: any) => {
            let data = j_res.items.map(({ link }) => link);
            res.json(data);
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err)
    })
}

export const getVenues = (req: Request, res: Response) => {
    let text: string = req.params.text.toLowerCase().replace(' ', '+').replace('ı', 'i').replace('ş', 's').replace('ğ', 'g').replace('ö', 'o').replace('ç', 'c');
    text = encodeURI(text);
    request({
        url: 'https://api.foursquare.com/v2/venues/search',
        method: 'GET',
        qs: {
            client_id: 'UVMWY3IGPHDTIHBOXRNDWDWZWNL1BM5JHC0YJWUO3RWNGXEI',
            client_secret: 'BXNV2440BYTQYTXJHMFLWBTHVEVFEUURK2BA3OAT5F0XNXB0',
            // ll: '40.7243,-74.0018',
            near: 'Istanbul',
            categoryId: '4d4b7105d754a06374d81259,4d4b7105d754a06376d81259',
            query: text,
            v: '20180323',
            limit: 5
        }
    }, function (err, response, body) {
        if (err) {
            console.error(err);
        } else {

            // res.json(JSON.parse(body));
            // request({
            //     uri: 'https://api.foursquare.com/v2/venues/54a5a527498eb4b58d8e0864/photos',
            //     method: 'GET',
            //     qs: {
            //         client_id: 'UVMWY3IGPHDTIHBOXRNDWDWZWNL1BM5JHC0YJWUO3RWNGXEI',
            //         client_secret: 'BXNV2440BYTQYTXJHMFLWBTHVEVFEUURK2BA3OAT5F0XNXB0',
            //         v: '20180323',
            //         limit: 10
            //     }
            // }, (err, response, body) => {
            //     res.json(JSON.parse(body));
            // })

        }
    });
}

export const getLogs = (req: Request, res: Response) => {
    let qLimit = parseInt(req.query.limit) || 25;
    let qSkip = parseInt(req.query.skip) || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Logs.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch((err) => {
        res.status(StoreMessages.STORE_NOT_EXIST.code).json(StoreMessages.STORE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}
