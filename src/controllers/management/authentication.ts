import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ManagementDB } from "../../configrations/database";
import { createSession } from "../../functions/session";
import { User } from "../../models/management/users";
import { createLog, LogType } from '../../utils/logger';
import { SessionMessages } from "../../utils/messages";

//////  /auth/login [POST]
export let Login = (req: Request, res: Response) => {
    let formData = req.body;
    ManagementDB.Users.find({ selector: { username: formData.username } }).then((users: any) => {
        if (users.docs.length > 0) {
            const User: User = users.docs[0];
            bcrypt.compare(formData.password, User.password, (err, same) => {
                if (!err && same) {
                    let session = createSession(User._id, req.ip);
                    ManagementDB.Sessions.find({ selector: { user_id: session.user_id } }).then(query => {
                        if (query.docs.length > 0) {
                            let tokenWillUpdate = query.docs[0];
                            session._id = tokenWillUpdate._id;
                            session._rev = tokenWillUpdate._rev;
                            ManagementDB.Sessions.put(session, {}).then(db_res => {
                                res.status(SessionMessages.SESSION_CREATED.code).json({ ...SessionMessages.SESSION_CREATED.response, ...{ token: db_res.id } });
                            }).catch(err => {
                                createLog(req, LogType.DATABASE_ERROR, err);
                                res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
                            });
                        } else {
                            ManagementDB.Sessions.post(session).then(db_res => {
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

//////  /auth/logout [POST]
export const Logout = (req: Request, res: Response) => {
    let AuthToken = req.headers.authorization;
    ManagementDB.Sessions.get(AuthToken.toString()).then(session => {
        ManagementDB.Sessions.remove(session).then(() => {
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

//////  /auth/verify [POST]
export const Verify = (req: Request, res: Response) => {
    let AuthToken = req.headers.authorization;
    ManagementDB.Sessions.get(AuthToken.toString()).then((session: any) => {
        if (session) {
            if (session.expire_date < Date.now()) {
                ManagementDB.Sessions.remove(session).then(() => {
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
