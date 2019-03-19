import { Request, Response } from "express";
import { ManagementDB } from '../../configrations/database';
import { CouchDB, RemoteCollection, RemoteDB } from '../../configrations/database';
import { SocialDB } from '../../configrations/database';
import { Database, DatabaseSecObject, DatabaseUser } from '../../models/management/database';
import { createLog, LogType } from '../../utils/logger';
import { DatabaseMessages } from "../../utils/messages";

export const createDatabase = (req: Request, res: Response) => {
    let newDatabase: Database = req.body;
    ManagementDB.Databases.find({ selector: { codename: newDatabase.codename } }).then(database => {
        if (database.docs.length > 0) {
            res.status(DatabaseMessages.DATABASE_EXIST.code).json(DatabaseMessages.DATABASE_EXIST.response);
        } else {
            newDatabase.timestamp = Date.now();
            ManagementDB.Databases.post(database).then(() => {
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

export const getDatabase = (req: Request, res: Response) => {
    let databaseID = req.params.id;
    ManagementDB.Databases.get(databaseID).then((obj: any) => {
        res.send(obj.doc);
    }).catch(err => {
        res.status(DatabaseMessages.DATABASE_NOT_EXIST.code).json(DatabaseMessages.DATABASE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

export const queryDatabases = (req: Request, res: Response) => {
    let qLimit = req.query.limit || 25;
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

export const openRemoteDB = (req: Request, res: Response) => {
    let qLimit = req.query.limit || 25;
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

export const getSocialDB = (req: Request, res: Response) => {
    let qLimit = req.query.limit || 25;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    SocialDB[req.params.db].find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        res.status(DatabaseMessages.DATABASE_NOT_EXIST.code).json(DatabaseMessages.DATABASE_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

export const createCollectionDB = (req: Request, res: Response) => {
    const creds = req.body;
    ManagementDB.Databases.get(req.params.id).then((db_res: any) => {
        const DB = CouchDB(db_res).db;
        const RemoteCheck = RemoteCollection(db_res, req.params.db, creds.username, creds.password);
        const UsersDB = DB.use('_users');

        let newUser = new DatabaseUser(creds.username, creds.password);

        let secObj: DatabaseSecObject | any = {
            admins: {
                names: [],
                roles: []
            },
            members: {
                names: [creds.username],
                roles: []
            }
        };
        UsersDB.insert(newUser).then(() => {
            DB.create(req.params.db).then(() => {
                DB.use(req.params.db).insert(secObj, "_security").then(() => {
                    RemoteCheck.info().then(remote_res => {
                        res.json({ ok: true, message: remote_res })
                    }).catch(() => {
                        res.json({ remote: false });
                    })
                }).catch(err => {
                    res.json({ error: err });
                });
            }).catch(err => {
                res.json({ error: err });
            });
        });
    }).catch(err => {
        res.json({ error: err });
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}