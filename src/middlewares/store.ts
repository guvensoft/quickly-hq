import { NextFunction, Request, Response } from 'express';
import { StoreDB, ManagementDB } from '../configrations/database';
import { createLog, LogType } from '../utils/logger';
import { SessionMessages } from '../utils/messages';

export const StoreAuthenticateGuard = (req: Request, res: Response, next: NextFunction) => {
    let AuthToken = req.headers.authorization;
    let StoreID = req.headers.store;
    if (AuthToken && StoreID) {
        StoreDB.Sessions.get(AuthToken.toString()).then((session) => {
            if (session) {
                if (StoreID) {
                    req.app.locals.user = session.user_id;
                    next();
                } else {
                    res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
                    createLog(req, LogType.UNVALID_SCHEMA_ERROR, 'Store ID Not Found!');
                }
            } else {
                res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
                createLog(req, LogType.AUTH_ERROR, 'Store ID Not Found!');
            }
        }).catch(err => {
            res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        });
    } else {
        res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
        createLog(req, LogType.AUTH_ERROR, 'Auth Headers Not Found!');
    }
}

export const StoreGuard = (req: Request, res: Response, next: NextFunction) => {
    let StoreID: any = req.headers.store;
    ManagementDB.Stores.get(StoreID).then(res => {
        next();
    }).catch(err => {
        res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
        createLog(req, LogType.AUTH_ERROR, 'Store Not Exist!');
    })
}


export const AccountGuard = (req: Request, res: Response, next: NextFunction) => {
    let StoreID: any = req.headers.store;
    let OwnerID: any = req.app.locals.user;
    ManagementDB.Owners.get(OwnerID).then(owner => {
        let hasOwnership = owner.stores.includes(StoreID);
        if (hasOwnership) {
            next();
        } else {
            res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
            createLog(req, LogType.AUTH_ERROR, 'Has No Ownership!');
        }
    }).catch(err => {
        res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
        createLog(req, LogType.AUTH_ERROR, 'Owner Not Exist!');
    })
}