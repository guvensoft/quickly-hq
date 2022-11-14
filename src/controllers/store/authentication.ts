import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { defaultSessionTime } from "../../configrations/session";
import { ManagementDB, StoresDB, UtilsDB } from "../../configrations/database";
import { createSession, isSessionExpired } from "../../functions/shared/session";
import { Owner } from "../../models/management/owner";
import { Session } from "../../models/management/session";
import { createLog, LogType } from '../../utils/logger';
import { SessionMessages } from "../../utils/messages";
import { sendSms } from "../../configrations/sms";
import { OtpCheck } from "../../models/utils/otp";

export const Login = (req: Request, res: Response) => {
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
    StoresDB.Sessions.get(AuthToken).then((session: Session) => {
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

export const Message = (req: Request, res: Response) => {

    const code: number = Math.floor(1000 + Math.random() * 9000);
    const type: 'securelogin' | 'newpassword' = req.body.type;
    const numb: string = req.body.number;

    ManagementDB.Owners.find({ selector: { phone_number: parseInt(numb) } }).then(Owners => {
        if (Owners.docs.length > 0) {
            const Owner = Owners.docs[0];
            sendSms(Owner.phone_number.toString(), `Doğrulama Kodunuz: ${code}`)
            switch (type) {
                case 'securelogin':
                    res.status(200).json({ ok: true, code: code });
                    break;
                case 'newpassword':
                    const otpCheck: OtpCheck = { owner: Owner._id, code: code, expiry: Date.now() + 120000 };
                    UtilsDB.Otp.post(otpCheck).then(message => {
                        res.status(200).json({ ok: true, code: code, id: message.id });
                    }).catch(err => {
                        console.log(err);
                        res.status(404).json({ ok: false, message: 'Sistemde Hata Oluştu! Tekrar Deneyiniz!' });
                    })
                    break;
                default:
                    res.status(200).json({ ok: true, code: code });
                    break;
            }
        } else {
            res.status(404).json({ ok: false, message: 'Sistemde Kayıtlı Numara Bulunamadı!' });
        }
    }).catch(err => {
        res.status(404).json({ ok: false, message: 'Sistemde Kayıtlı Numara Bulunamadı!' });
    })
}

export const Change = async (req: Request, res: Response) => {
    const messageId: string = req.body.message_id;
    const newPassword: string = req.body.new_password;
    const verificationCode: string = req.body.verification_code;
    try {
        let OtpCheck = await UtilsDB.Otp.get(messageId);
        let Owner = await ManagementDB.Owners.get(OtpCheck.owner);
        if (OtpCheck.code == parseInt(verificationCode)) {
            bcrypt.genSalt(10, (err, salt) => {
                if (!err) {
                    bcrypt.hash(newPassword, salt, (err, hashedPassword) => {
                        if (!err) {
                            Owner.password = hashedPassword;
                            Owner.timestamp = Date.now();
                            ManagementDB.Owners.put(Owner).then(isOk => {
                                console.log(isOk);
                                res.status(200).send({ ok: true, message: 'Şifre Değiştirildi' })
                            }).catch(err => {
                                res.status(400).json({ ok: false, message: 'İşlem Sırasında Hata Oluştu!' })
                                createLog(req, LogType.DATABASE_ERROR, err);
                            })
                        } else {
                            res.status(400).json({ ok: false, message: 'İşlem Sırasında Hata Oluştu!' })
                            createLog(req, LogType.INNER_LIBRARY_ERROR, err);
                        }
                    });
                } else {
                    res.status(400).json({ ok: false, message: 'İşlem Sırasında Hata Oluştu!' })
                    createLog(req, LogType.INNER_LIBRARY_ERROR, err);
                }
            });
        } else {
            res.status(400).json({ ok: false, message: 'Doğrulama Kodu Yanlış' })
        }
    } catch (error) {
        res.status(400).json({ ok: false, message: 'İşlem Sırasında Hata Oluştu!' })
    }
}