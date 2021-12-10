import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { defaultSessionTime } from "../../configrations/session";
import { ManagementDB, StoresDB } from "../../configrations/database";
import { createSession, isSessionExpired } from "../../functions/shared/session";
import { Owner } from "../../models/management/owner";
import { Session } from "../../models/management/session";
import { createLog, LogType } from '../../utils/logger';
import { SessionMessages } from "../../utils/messages";

export let Login = (req: Request, res: Response) => {
    let formData = req.body;
    ManagementDB.Owners.find({ selector: { username: formData.username } }).then((owners: any) => {
        if (owners.docs.length > 0) {
            let Owner: Owner = owners.docs[0];
            bcrypt.compare(formData.password, Owner.password, (err, same) => {
                if (!err && same) {
                    let session = createSession(Owner._id, req.ip);
                    delete Owner.password;
                    delete Owner.username;
                    StoresDB.Sessions.find({ selector: { user_id: session.user_id } }).then(query => {
                        if (query.docs.length > 0) {
                            let tokenWillUpdate = query.docs[0];
                            session._id = tokenWillUpdate._id;
                            session._rev = tokenWillUpdate._rev;
                            StoresDB.Sessions.put(session, {}).then(db_res => {
                                res.status(SessionMessages.SESSION_CREATED.code).json({ ...SessionMessages.SESSION_CREATED.response, ...{ token: db_res.id, owner: Owner } });
                            }).catch(err => {
                                createLog(req, LogType.DATABASE_ERROR, err);
                                res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
                            });
                        } else {
                            StoresDB.Sessions.post(session).then(db_res => {
                                res.status(SessionMessages.SESSION_CREATED.code).json({ ...SessionMessages.SESSION_CREATED.response, ...{ token: db_res.id, owner: Owner } });
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
    StoresDB.Sessions.get(AuthToken.toString()).then(session => {
        StoresDB.Sessions.remove(session).then(() => {
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
    StoresDB.Sessions.get(AuthToken).then((session: any) => {
        if (session) {
            if (isSessionExpired(session)) {
                StoresDB.Sessions.remove(session).then(() => {
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


export const Refresh = (req: Request, res: Response) => {
    let AuthToken = req.headers.authorization;
    StoresDB.Sessions.get(AuthToken).then((session: any) => {
        if (session) {
            if (isSessionExpired(session)) {
                StoresDB.Sessions.remove(session).then(() => {
                    res.status(SessionMessages.SESSION_EXPIRED.code).json(SessionMessages.SESSION_EXPIRED.response);
                }).catch(err => {
                    createLog(req, LogType.DATABASE_ERROR, err);
                    res.status(SessionMessages.SESSION_NOT_DELETED.code).json(SessionMessages.SESSION_NOT_DELETED.response);
                })
            } else {
                session.timestamp = Date.now();
                session.expire_date = Date.now() + defaultSessionTime;
                StoresDB.Sessions.put(session).then(isUpdated => {
                    if (isUpdated.ok) {
                        res.status(SessionMessages.SESSION_UPDATED.code).json({ ...SessionMessages.SESSION_UPDATED.response, ...{ token: isUpdated.id } });
                    }
                }).catch(err => {
                    createLog(req, LogType.AUTH_ERROR, err);
                    res.status(SessionMessages.SESSION_NOT_UPDATED.code).json(SessionMessages.SESSION_NOT_UPDATED.response);
                })

            }
        } else {
            res.status(SessionMessages.SESSION_NOT_EXIST.code).json(SessionMessages.SESSION_NOT_EXIST.response);
        }
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(SessionMessages.SESSION_NOT_EXIST.code).json(SessionMessages.SESSION_NOT_EXIST.response);
    })
}
