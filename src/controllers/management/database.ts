import { Request, Response } from "express";
import { CouchDB, DatabaseQueryLimit, ManagementDB, RemoteCollection, RemoteDB, SocialDB } from '../../configrations/database';
import { Database, DatabaseUser } from '../../models/management/database';
import { createLog, LogType } from '../../utils/logger';
import { DatabaseMessages } from "../../utils/messages";

//////  /database [POST]
export const createDatabase = (req: Request, res: Response) => {
    let newDatabase: Database = req.body;
    ManagementDB.Databases.find({ selector: { codename: newDatabase.codename } }).then(database => {
        if (database.docs.length > 0) {
            res.status(DatabaseMessages.DATABASE_EXIST.code).json(DatabaseMessages.DATABASE_EXIST.response);
        } else {
            newDatabase.timestamp = Date.now();
            ManagementDB.Databases.post(newDatabase).then(() => {
                res.status(DatabaseMessages.DATABASE_CREATED.code).json(DatabaseMessages.DATABASE_CREATED.response);
            }).catch(err => {
                res.status(DatabaseMessages.DATABASE_NOT_CREATED.code).json(DatabaseMessages.DATABASE_NOT_CREATED.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            })
        }
    }).catch((err) => {
        res.status(DatabaseMessages.DATABASE_NOT_CREATED.code).json(DatabaseMessages.DATABASE_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /database/:id [PUT]
export const updateDatabase = (req: Request, res: Response) => {
    let databaseID = req.params.id;
    let formData = req.body;
    ManagementDB.Databases.get(databaseID).then(obj => {
        ManagementDB.Databases.put(Object.assign(obj, formData)).then(() => {
            res.status(DatabaseMessages.DATABASE_UPDATED.code).json(DatabaseMessages.DATABASE_UPDATED.response);
        }).catch(err => {
            createLog(req, LogType.DATABASE_ERROR, err);
            res.status(DatabaseMessages.DATABASE_NOT_UPDATED.code).json(DatabaseMessages.DATABASE_NOT_UPDATED.response);
        })
    }).catch(err => {
        res.status(DatabaseMessages.DATABASE_NOT_EXIST.code).json(DatabaseMessages.DATABASE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /database/:id [DELETE]
export const deleteDatabase = (req: Request, res: Response) => {
    let databaseID = req.params.id;
    ManagementDB.Databases.get(databaseID).then(obj => {
        ManagementDB.Databases.remove(obj).then(() => {
            res.status(DatabaseMessages.DATABASE_DELETED.code).json(DatabaseMessages.DATABASE_DELETED.response);
        }).catch(err => {
            createLog(req, LogType.DATABASE_ERROR, err);
            res.status(DatabaseMessages.DATABASE_NOT_DELETED.code).json(DatabaseMessages.DATABASE_NOT_DELETED.response);
        })
    }).catch(err => {
        res.status(DatabaseMessages.DATABASE_NOT_EXIST.code).json(DatabaseMessages.DATABASE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /database/:id [GET]
export const getDatabase = (req: Request, res: Response) => {
    let databaseID = req.params.id;
    ManagementDB.Databases.get(databaseID).then((obj: any) => {
        res.send(obj.doc);
    }).catch(err => {
        res.status(DatabaseMessages.DATABASE_NOT_EXIST.code).json(DatabaseMessages.DATABASE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /databases + QueryString [GET]
export const queryDatabases = (req: Request, res: Response) => {
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Databases.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        res.status(DatabaseMessages.DATABASE_NOT_EXIST.code).json(DatabaseMessages.DATABASE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /database/remote/:id [GET]
export const listRemoteDB = (req: Request, res: Response) => {
    ManagementDB.Databases.get(req.params.id).then((db_res: any) => {
        CouchDB(db_res).db.list().then(couch_res => {
            res.json(couch_res);
        }).catch(err => {
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(DatabaseMessages.DATABASE_NOT_EXIST.code).json(DatabaseMessages.DATABASE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /database/remote/:id/:db [GET]
export const openRemoteDB = (req: Request, res: Response) => {
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Databases.get(req.params.id).then((db_res: any) => {
        RemoteDB(db_res, req.params.db).find({ selector: req.query, limit: qLimit, skip: qSkip }).then(remote_res => {
            res.json(remote_res.docs);
        }).catch(err => {
            res.json(err)
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(DatabaseMessages.DATABASE_NOT_EXIST.code).json(DatabaseMessages.DATABASE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};
//////  /database/remote/:id/:db [GET]
export const getSocialDB = (req: Request, res: Response) => {
    const qLimit = req.query.limit || DatabaseQueryLimit;
    const qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    SocialDB[req.params.db].find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        res.status(DatabaseMessages.DATABASE_NOT_EXIST.code).json(DatabaseMessages.DATABASE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};
//////  /database/remote/:id/:db [POST]
export const createCollectionDB = (req: Request, res: Response) => {
    const creds = req.body;
    ManagementDB.Databases.get(req.params.id).then((db_res: any) => {
        const DB = CouchDB(db_res).db;
        const RemoteCheck = RemoteCollection(db_res, req.params.db, creds.username, creds.password);
        const UsersDB = DB.use('_users');
        let newUser = new DatabaseUser(creds.username, creds.password);
        UsersDB.insert(newUser).then(() => {
            DB.create(req.params.db).then(() => {
                DB.use(req.params.db).insert(newUser.secObject(), "_security").then(() => {
                    RemoteCheck.info().then(remote_res => {
                        res.json({ ok: true, message: remote_res })
                    }).catch((err) => {
                        res.json({ ok: false, message: err });
                    })
                }).catch(err => {
                    res.json({ ok: false, message: err });
                });
            }).catch(err => {
                res.json({ ok: false, message: err });
            });
        });
    }).catch(err => {
        res.json({ ok: false, message: err });
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}