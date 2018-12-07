import { Response, Request } from "express";
import { ManagementDB } from '../databases/management';
import { SocialDB } from '../databases/social';
import { CouchDB, RemoteDB } from '../databases/remote';
import { Database } from '../models/management/database';
import { createLog, LogType } from '../utils/logger';

export const createDatabase = (req: Request, res: Response) => {
    let formData = req.body;
    let database = new Database(formData.host, formData.port, formData.username, formData.password, formData.codename, Date.now());
    ManagementDB.Databases.post(database).then(db_res => {
        res.json({ ok: true, message: 'Veritabanı Eklendi' })
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.json({ ok: false, message: 'Veritabanı Oluşturulamadı' });
    })
};

export const updateDatabase = (req: Request, res: Response) => {
    let dbID = req.params.id;
    let formData = req.body;
    ManagementDB.Databases.get(dbID).then(obj => {
        ManagementDB.Databases.put(Object.assign(obj, formData)).then(db_res => {
            res.json({ ok: true, message: 'Veritabanı Düzenlendi' });
        }).catch(err => {
            createLog(req, LogType.DATABASE_ERROR, err);
            res.json({ ok: false, message: 'Belirtilen Veritabanı Düzenlenirken Hata Oluştu' });
        })
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.json({ ok: false, message: 'Belirtilen Veritabanı Bulunamadı.' });
    });
};

export const deleteDatabase = (req: Request, res: Response) => {
    let dbID = req.params.id;
    ManagementDB.Databases.get(dbID).then(obj => {
        ManagementDB.Databases.remove(obj).then(db_res => {
            res.json({ ok: true, message: 'Veritabanı Silindi' });
        }).catch(err => {
            createLog(req, LogType.DATABASE_ERROR, err);
            res.json({ ok: false, message: 'Veritabanı Silinirken Hata Oluştu.' });
        })
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.json({ ok: false, message: 'Belirtilen Veritabanı Bulunamadı.' });
    });
};

export const getDatabase = (req: Request, res: Response) => {
    let databaseID = req.params.id;
    ManagementDB.Databases.get(databaseID).then((obj: any) => {
        res.send(obj.doc);
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.json({ ok: false, message: 'Belirtilen Veritabanı Bulunamadı.' });
    });
};

export const queryDatabase = (req: Request, res: Response) => {
    let qLimit = parseInt(req.query.limit) || 25;
    let qSkip = parseInt(req.query.skip) || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Databases.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.json({ ok: false, message: 'Veritabanı Sorgusunda Hata!' });
    });
};


export const listRemoteDB = (req: Request, res: Response) => {
    ManagementDB.Databases.get(req.params.id).then((db_res: any) => {
        CouchDB(db_res).db.list().then(couch_res => {
            res.json(couch_res);
        }).catch(err => {
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

export const openRemoteDB = (req: Request, res: Response) => {
    ManagementDB.Databases.get(req.params.id).then((db_res: any) => {
        RemoteDB(db_res, req.params.name).allDocs({ include_docs: true }).then(remote_res => {
            res.json(remote_res);
        }).catch(err => {
            console.log(err);
            res.json(err)
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        console.log(err);
        res.json(err)
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

export const getSocialDB = (req: Request, res: Response) => {
    let qLimit = parseInt(req.query.limit) || 25;
    let qSkip = parseInt(req.query.skip) || 0;
    delete req.query.skip;
    delete req.query.limit;
    SocialDB[req.params.db].find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.json({ ok: false, message: 'Sosyal Veritabanı Sorgusunda Hata!' });
    });
};