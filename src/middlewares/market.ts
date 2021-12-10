import { NextFunction, Request, Response } from 'express';
import { StoresDB, ManagementDB } from '../configrations/database';
import { createLog, LogType } from '../utils/logger';
import { SessionMessages } from '../utils/messages';
import { Session } from '../models/management/session';
import { isSessionExpired } from '../functions/shared/session';
import { defaultSessionTime } from '../configrations/session';
import { StoreCategory, StoreType } from '../models/management/store';


export const MarketAccountGuard = (req: Request, res: Response, next: NextFunction) => {
    let AuthToken = req.headers.authorization;
    if (AuthToken) {
        StoresDB.Sessions.get(AuthToken.toString()).then((session: Session) => {
            if (session) {
                res.locals.user = session.user_id;
                if (isSessionExpired(session)) {
                    StoresDB.Sessions.remove(session).then(isRemoved => {
                        res.status(SessionMessages.SESSION_EXPIRED.code).json(SessionMessages.SESSION_EXPIRED.response);
                        createLog(req, LogType.AUTH_ERROR, 'Session Expired!');
                    }).catch(err => {
                        res.status(SessionMessages.SESSION_NOT_UPDATED.code).json(SessionMessages.SESSION_NOT_UPDATED.response);
                        createLog(req, LogType.AUTH_ERROR, 'Session Removing Error!');
                    })
                } else {
                    next();
                }
            } else {
                res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
                createLog(req, LogType.AUTH_ERROR, 'Owner Session Not Found!');
            }
        }).catch(err => {
            res.status(SessionMessages.SESSION_NOT_EXIST.code).json(SessionMessages.SESSION_NOT_EXIST.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        });
    } else {
        res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
        createLog(req, LogType.AUTH_ERROR, 'Auth Headers Not Found!');
    }

}



export const MarketStoreGuard = (req: Request, res: Response, next: NextFunction) => {
    let StoreID: any = req.headers.store;
    ManagementDB.Stores.get(StoreID).then(Store => {
        res.locals.isOnTrade = (Store.type == StoreType.RESTAURANT ? true : false)
        if (Array.isArray(Store.category)) {
            const Categories = Store.category as StoreCategory[];
            res.locals.isStoreProhibited != Categories.includes(StoreCategory.BISTRO || StoreCategory.PUB || StoreCategory.NIGHTCLUB || StoreCategory.COCKTAIL)
        } else {
            res.locals.isStoreProhibited != (Store.category == StoreCategory.BISTRO || StoreCategory.PUB || StoreCategory.NIGHTCLUB || StoreCategory.COCKTAIL ? true : false)
        }
        next();
    }).catch(err => {
        res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
        createLog(req, LogType.AUTH_ERROR, 'Store Not Exist!');
    })
}