import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ManagementDB } from "../databases/management";
import { User } from "../models/management/users";
import { AuthObject } from "../models/management/auth";
import { createLog, LogType } from '../utils/logger';

export let Login = (req: Request, res: Response) => {
    let formData = req.body;
    ManagementDB.Users.find({ selector: { username: formData.username } }).then((users: any) => {
        if (users.docs.length > 0) {
            const User: User = users.docs[0];
            bcrypt.compare(formData.password, User.password, (err, same) => {
                if (!err && same) {
                    let auth_object = new AuthObject(User._id, req.ip, Date.now(), (Date.now() + 360000));
                    ManagementDB.Sessions.find({ selector: { user_id: auth_object.user_id } }).then(query => {
                        if (query.docs.length > 0) {
                            let tokenWillUpdate = query.docs[0];
                            auth_object._id = tokenWillUpdate._id;
                            auth_object._rev = tokenWillUpdate._rev;
                            ManagementDB.Sessions.put(auth_object, {}).then(db_res => {
                                res.json({ ok: true, message: "Giriş Başarılı", token: db_res.id });
                            }).catch(err => {
                                createLog(req, LogType.DATABASE_ERROR, err);
                                res.json(err)
                            });
                        } else {
                            ManagementDB.Sessions.post(auth_object).then(db_res => {
                                res.json({ ok: true, message: "Giriş Başarılı", token: db_res.id });
                            }).catch(err => {
                                createLog(req, LogType.DATABASE_ERROR, err);
                                res.json(err);
                            })
                        }
                    }).catch(err => {
                        createLog(req, LogType.DATABASE_ERROR, err);
                        res.json(err);
                    })
                } else {
                    createLog(req, LogType.INNER_LIBRARY_ERROR, err);
                    res.json({ ok: false, message: "Hatalı Kullanıcı Adı veya Parola!" });
                }
            });
        } else {
            res.json({ ok: false, message: "Hatalı Kullanıcı Adı veya Parola!" });
        }
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.json(err);
    });
};

export const Logout = (req: Request, res: Response) => {
    let AuthToken = req.headers.authorization;
    ManagementDB.Sessions.get(AuthToken.toString()).then(session => {
        ManagementDB.Sessions.remove(session).then(db_res => {
            res.status(201).json({ ok: true });
        }).catch(err => {
            createLog(req, LogType.DATABASE_ERROR, err);
            res.status(201).json({ ok: false });
        });
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(201).json({ ok: false });
    })
};

export const Verify = (req: Request, res: Response) => {
    let AuthToken = req.headers.authorization;
    if (AuthToken) {
        ManagementDB.Sessions.get(AuthToken.toString()).then((session: any) => {
            if (session) {
                if (session.expire_date < Date.now()) {
                    ManagementDB.Sessions.remove(session).then((db_res) => {
                        res.json({ ok: false, message: 'SESSION EXPIRED' });
                    }).catch(err => {
                        createLog(req, LogType.DATABASE_ERROR, err);
                        res.json({ ok: false, message: 'NO ACCESSIBLE SESSION' });
                    })
                } else {
                    delete session._id;
                    delete session._rev;
                    delete session.timestamp;
                    res.json({ ok: true, data: session });
                }
            } else {
                res.json({ ok: false, message: 'NO SESSION' });
            }
        }).catch(err => {
            createLog(req, LogType.DATABASE_ERROR, err);
            res.json({ ok: false, message: 'NO SESSION' });
        })
    } else {
        res.json({ ok: false, message: 'NO HEADER' });
    }
}
