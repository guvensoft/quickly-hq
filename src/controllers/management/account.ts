import { Response, Request } from "express";
import * as bcrypt from "bcrypt";
import { ManagementDB } from "../../databases/management";
import { AccountMessages } from '../../utils/messages';
import { Account, AccountStatus } from "../../models/management/account";
import { createLog, LogType } from '../../utils/logger';

export const createAccount = (req: Request, res: Response) => {
    let newAccount: Account = req.body;
    ManagementDB.Accounts.find({ selector: { username: newAccount.username } }).then(user => {
        if (user.docs.length > 0) {
            res.status(AccountMessages.ACCOUNT_EXIST.code).json(AccountMessages.ACCOUNT_EXIST.response);
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                if (!err) {
                    bcrypt.hash(newAccount.password, salt, (err, hashedPassword) => {
                        if (!err) {
                            newAccount.password = hashedPassword;
                            newAccount.status = AccountStatus.ACTIVE;
                            newAccount.timestamp = Date.now();
                            ManagementDB.Accounts.post(newAccount).then(db_res => {
                                res.status(AccountMessages.ACCOUNT_CREATED.code).json(AccountMessages.ACCOUNT_CREATED.response);
                            }).catch(err => {
                                res.status(AccountMessages.ACCOUNT_NOT_CREATED.code).json(AccountMessages.ACCOUNT_NOT_CREATED.response);
                                createLog(req, LogType.DATABASE_ERROR, err);
                            });
                        } else {
                            res.status(AccountMessages.ACCOUNT_NOT_CREATED.code).json(AccountMessages.ACCOUNT_NOT_CREATED.response);
                            createLog(req, LogType.INNER_LIBRARY_ERROR, err);
                        }
                    });
                } else {
                    res.status(AccountMessages.ACCOUNT_NOT_CREATED.code).json(AccountMessages.ACCOUNT_NOT_CREATED.response);
                    createLog(req, LogType.INNER_LIBRARY_ERROR, err);
                }
            });
        }
    }).catch(err => {
        res.status(AccountMessages.ACCOUNT_NOT_CREATED.code).json(AccountMessages.ACCOUNT_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

export const updateAccount = (req: Request, res: Response) => {
    let accountID = req.params.id;
    let formData = req.body;
    ManagementDB.Accounts.get(accountID).then(obj => {
        ManagementDB.Accounts.put(Object.assign(obj, formData)).then(db_res => {
            res.status(AccountMessages.ACCOUNT_UPDATED.code).json(AccountMessages.ACCOUNT_UPDATED.response);
        }).catch(err => {
            res.status(AccountMessages.ACCOUNT_UPDATED.code).json(AccountMessages.ACCOUNT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(AccountMessages.ACCOUNT_NOT_EXIST.code).json(AccountMessages.ACCOUNT_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

export const getAccount = (req: Request, res: Response) => {
    let accountID = req.params.id;
    ManagementDB.Accounts.get(accountID).then((obj: any) => {
        res.send(obj);
    }).catch(err => {
        res.status(AccountMessages.ACCOUNT_NOT_EXIST.code).json(AccountMessages.ACCOUNT_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

export const deleteAccount = (req: Request, res: Response) => {
    let accountID = req.params.id;
    ManagementDB.Accounts.get(accountID).then(obj => {
        ManagementDB.Accounts.remove(obj).then(db_res => {
            res.status(AccountMessages.ACCOUNT_DELETED.code).json(AccountMessages.ACCOUNT_DELETED.response);
        }).catch(err => {
            res.status(AccountMessages.ACCOUNT_NOT_DELETED.code).json(AccountMessages.ACCOUNT_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(AccountMessages.ACCOUNT_NOT_EXIST.code).json(AccountMessages.ACCOUNT_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
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
        res.status(AccountMessages.ACCOUNT_NOT_EXIST.code).json(AccountMessages.ACCOUNT_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};