import { NextFunction, Request, Response } from 'express';
import { StoresDB, ManagementDB } from '../configrations/database';
import { createLog, LogType } from '../utils/logger';
import { SessionMessages } from '../utils/messages';
import { Session } from '../models/management/session';
import { isSessionExpired } from '../functions/session';

export const StoreAuthenticateGuard = (req: Request, res: Response, next: NextFunction) => {
    let AuthToken = req.headers.authorization;
    if (AuthToken) {
        StoresDB.Sessions.get(AuthToken.toString()).then((session: Session) => {
            if (session) {

                req.app.locals.user = session.user_id;

                session.timestamp = Date.now();

                if(isSessionExpired(session)){
                    console.log('Session Expired!',session)
                }else{
                    console.log('Session Not Expired!',session)
                }
                StoresDB.Sessions.put(session);
                
                next();
            } else {
                res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
                createLog(req, LogType.AUTH_ERROR, 'Owner Session Not Found!');
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