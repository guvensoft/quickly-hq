import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { StoreDB } from "../../configrations/database";
import { AuthObject } from "../../models/management/auth";
import { Owner } from "../../models/store/owner";
import { createLog, LogType } from '../../utils/logger';
import { SessionMessages } from "../../utils/messages";

export let Login = (req: Request, res: Response) => {
    let formData = req.body;
    StoreDB.Owners.find({ selector: { username: formData.username } }).then((owners: any) => {
        if (owners.docs.length > 0) {
            const Owner: Owner = owners.docs[0];
            bcrypt.compare(formData.password, Owner.password, (err, same) => {
                if (!err && same) {
                    let auth_object = new AuthObject(Owner._id, req.ip, Date.now(), (Date.now() + 360000));
                    StoreDB.Sessions.find({ selector: { user_id: auth_object.user_id } }).then(query => {
                        if (query.docs.length > 0) {
                            let tokenWillUpdate = query.docs[0];
                            auth_object._id = tokenWillUpdate._id;
                            auth_object._rev = tokenWillUpdate._rev;
                            StoreDB.Sessions.put(auth_object, {}).then(db_res => {
                                res.status(SessionMessages.SESSION_CREATED.code).json({ ...SessionMessages.SESSION_CREATED.response, ...{ token: db_res.id } });
                            }).catch(err => {
                                createLog(req, LogType.DATABASE_ERROR, err);
                                res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
                            });
                        } else {
                            StoreDB.Sessions.post(auth_object).then(db_res => {
                                res.status(SessionMessages.SESSION_CREATED.code).json({ ...SessionMessages.SESSION_CREATED.response, ...{ token: db_res.id } });
                            }).catch(err => {
                                createLog(req, LogType.DATABASE_ERROR, err);
                                res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
                            })
                        }
                    }).catch(err => {
                        createLog(req, LogType.DATABASE_ERROR, err);
                        res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
                    })
                } else {
                    createLog(req, LogType.INNER_LIBRARY_ERROR, err);
                    res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
                }
            });
        } else {
            res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
        }
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
    });
};

export const Logout = (req: Request, res: Response) => {
    let AuthToken = req.headers.authorization;
    StoreDB.Sessions.get(AuthToken.toString()).then(session => {
        StoreDB.Sessions.remove(session).then(() => {
            res.status(SessionMessages.SESSION_DELETED.code).json(SessionMessages.SESSION_DELETED.response);
        }).catch(err => {
            createLog(req, LogType.DATABASE_ERROR, err);
            res.status(SessionMessages.SESSION_NOT_DELETED.code).json(SessionMessages.SESSION_NOT_DELETED.response);
        });
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(SessionMessages.SESSION_NOT_DELETED.code).json(SessionMessages.SESSION_NOT_DELETED.response);
    })
};

export const Verify = (req: Request, res: Response) => {
    let AuthToken = req.headers.authorization;
    StoreDB.Sessions.get(AuthToken.toString()).then((session: any) => {
        if (session) {
            if (session.expire_date < Date.now()) {
                StoreDB.Sessions.remove(session).then(() => {
                    res.status(SessionMessages.SESSION_EXPIRED.code).json(SessionMessages.SESSION_EXPIRED.response);
                }).catch(err => {
                    createLog(req, LogType.DATABASE_ERROR, err);
                    res.status(SessionMessages.SESSION_NOT_DELETED.code).json(SessionMessages.SESSION_NOT_DELETED.response);
                })
            } else {
                delete session._id, session._rev, session.timestamp;
                res.status(SessionMessages.SESSION_UPDATED.code).json({ ...SessionMessages.SESSION_UPDATED.response, ...{ data: session } });
            }
        } else {
            res.status(SessionMessages.SESSION_NOT_EXIST.code).json(SessionMessages.SESSION_NOT_EXIST.response);
        }
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(SessionMessages.SESSION_NOT_EXIST.code).json(SessionMessages.SESSION_NOT_EXIST.response);
    })
}
