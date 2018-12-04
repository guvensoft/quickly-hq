import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ManagementDB } from "../databases/management";
import { User } from "../models/management/users";
import { AuthObject } from "../models/management/auth";

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
                                if (db_res.ok) {
                                    res.json({ ok: true, message: "Giriş Başarılı", token: db_res.id });
                                } else {
                                    ////// Error
                                    res.json({ ok: false, message: "Hatalı Oluştu Tekrar Deneyiniz!" });
                                }
                            }).catch(err => {
                                ////// Error
                                res.json(err)
                            });
                        } else {
                            ManagementDB.Sessions.post(auth_object).then(db_res => {
                                if (db_res.ok) {
                                    res.json({ ok: true, message: "Giriş Başarılı", token: db_res.id });
                                } else {
                                    ////// Error
                                    res.json({ ok: false, message: "Hatalı Oluştu Tekrar Deneyiniz!" });
                                }
                            }).catch(err => {
                                ////// Error
                                res.json(err);
                            })
                        }
                    })
                } else {
                    ////// Error
                    res.json({ ok: false, message: "Hatalı Kullanıcı Adı veya Parola!" });
                }
            });
        } else {
            ////// Error
            res.json({ ok: false, message: "Hatalı Kullanıcı Adı veya Parola!" });
        }
    });
};

export const Logout = (req: Request, res: Response) => {
    let AuthToken = req.headers.authorization;
    ManagementDB.Sessions.get(AuthToken.toString()).then(session => {
        ManagementDB.Sessions.remove(session).then(db_res => {
            if (db_res.ok) {
                res.status(201).json({ ok: true });
            } else {
                ////// Error
                res.status(201).json({ ok: false });
            }
        }).catch(err => {
            ////// Error
            res.status(201).json({ ok: false });
        });
    }).catch(err => {
        ////// Error
        res.status(201).json({ ok: false });
    })
};

export const Register = (req: Request, res: Response) => {
    let formData = req.body;
    ManagementDB.Users.find({ selector: { username: formData.username } }).then(user => {
        if (user.docs.length > 0) {
            ////// Error
            res.json({ ok: false, message: "Girmiş olduğunuz Kullanıcı Adı mevcut. Lütfen farklı bir kullanıcı adı giririniz." });
        } else {
            if (formData.password == formData.repassword) {
                bcrypt.genSalt(10, (err, salt) => {
                    if (!err) {
                        bcrypt.hash(formData.password, salt, (err, hashString) => {
                            if (!err) {
                                let newUser = new User(formData.username, hashString, formData.fullname, formData.email, formData.phone_number, Date.now(), '', formData.group);
                                ManagementDB.Users.post(newUser).then(db_res => {
                                    if (db_res.ok) {
                                        res.json({ ok: true, message: "Hesap oluşturuldu." });
                                    } else {
                                        ////// Error
                                        res.json({ ok: false, message: "Kullanıcı oluşturulamadı! Lütfen tekrar deneyin." });
                                    }
                                }).catch(err => {
                                    ////// Error
                                    res.json({ ok: false, message: "Kullanıcı oluşturulamadı! Lütfen tekrar deneyin." });
                                });
                            } else {
                                ////// Error
                                res.json({ ok: false, message: "Kullanıcı oluşturulamadı! Lütfen tekrar deneyin." });
                            }
                        });
                    } else {
                        ////// Error
                        res.json({ ok: false, message: "Kullanıcı oluşturulamadı! Lütfen tekrar deneyin." });
                    }
                });
            } else {
                ////// Error
                res.json({ ok: false, message: "Girilen parolalar uyuşmuyor! Lütfen kontrol ediniz." });
            }
        }
    });
};

export const Verify = (req: Request, res: Response) => {
    let AuthToken = req.headers.authorization;
    if (AuthToken) {
        ManagementDB.Sessions.get(AuthToken.toString()).then((session: any) => {
            if (session) {
                if (session.expire_date < Date.now()) {
                    ManagementDB.Sessions.remove(session).then(() => {
                        ////// Error
                        res.json({ ok: false, message: 'SESSION EXPIRED' });
                    }).catch(err => {
                        ////// Error
                        res.json({ ok: false, message: 'NO ACCESSIBLE SESSION' });
                    })
                } else {
                    delete session._id;
                    delete session._rev;
                    delete session.timestamp;
                    res.json({ ok: true, data: session });
                }
            } else {
                ////// Error
                res.json({ ok: false, message: 'NO SESSION' });
            }
        }).catch(err => {
            ////// Error
            res.json({ ok: false, message: 'NO SESSION' });
        })
    } else {
        ////// Error
        res.json({ ok: false, message: 'NO HEADER' });
    }
}
