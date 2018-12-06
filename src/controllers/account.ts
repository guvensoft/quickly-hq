import { Response, Request } from "express";
import * as bcrypt from "bcrypt";
import { ManagementDB } from "../databases/management";
import { UserMessages } from '../utils/messages';
import { Account, AccountStatus } from "../models/management/account";

export const createAccount = (req: Request, res: Response) => {
    let formData = req.body;
    ManagementDB.Accounts.find({ selector: { username: formData.username } }).then(user => {
        if (user.docs.length > 0) {
            res.status(UserMessages.USER_EXIST.code).json(UserMessages.USER_EXIST.response);
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                if (!err) {
                    bcrypt.hash(formData.password, salt, (err, hashString) => {
                        if (!err) {
                            let newAccount = new Account(formData.username, hashString, formData.fullname, formData.email, formData.phone_number, Date.now(), '', AccountStatus.ACTIVE);
                            ManagementDB.Accounts.post(newAccount).then(db_res => {
                                if (db_res.ok) {
                                    res.status(UserMessages.USER_CREATED.code).json(UserMessages.USER_CREATED.response);
                                } else {
                                    ////// Error
                                    res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
                                }
                            }).catch(err => {
                                ////// Error
                                res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
                            });
                        } else {
                            ////// Error
                            res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
                        }
                    });
                } else {
                    ////// Error
                    res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
                }
            });
        }
    }).catch(err => {
        ////// Error
        res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
    });
};

export const updateAccount = (req: Request, res: Response) => {
    let accountID = req.params.id;
    let formData = req.body;
    ManagementDB.Accounts.get(accountID).then(obj => {
        ManagementDB.Accounts.put(Object.assign(obj, formData)).then(db_res => {
            if (db_res.ok) {
                res.status(UserMessages.USER_UPDATED.code).json(UserMessages.USER_UPDATED.response);
            }
        }).catch(err => {
            ////// Error
            res.status(UserMessages.USER_UPDATED.code).json(UserMessages.USER_UPDATED.response);
        })
    }).catch(err => {
        res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
    });
}

export const getAccount = (req: Request, res: Response) => {
    let accountID = req.params.id;
    ManagementDB.Accounts.get(accountID).then((obj: any) => {
        res.send(obj);
    }).catch(err => {
        ////// Error
        res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
    });
}

export const deleteAccount = (req: Request, res: Response) => {
    let accountID = req.params.id;
    ManagementDB.Accounts.get(accountID).then(obj => {
        ManagementDB.Accounts.remove(obj).then(db_res => {
            res.status(UserMessages.USER_DELETED.code).json(UserMessages.USER_DELETED.response);
        }).catch(err => {
            ////// Error
            res.status(UserMessages.USER_NOT_DELETED.code).json(UserMessages.USER_NOT_DELETED.response);
        })
    }).catch(err => {
        ////// Error
        res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
    });
}

export const queryAccounts = (req: Request, res: Response) => {
    let qLimit = parseInt(req.query.limit) || 25;
    let qSkip = parseInt(req.query.skip) || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Accounts.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        ////// Error
        res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
    });
};