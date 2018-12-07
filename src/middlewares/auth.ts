import { Request, Response, NextFunction } from 'express';
import { ManagementDB } from '../databases/management'
import { AdminHash } from '../configrations/secrets';

export const AuthenticateGuard = (req: Request, res: Response, next: NextFunction) => {
    let AuthToken = req.headers.authorization;
    if (AuthToken) {
        if (AuthToken == AdminHash) {
            next();
        } else {
            ManagementDB.Sessions.get(AuthToken.toString()).then((session) => {
                if (session) {
                    next();
                } else {
                    ////// Error
                    res.status(401).json({ ok: 'false', message: 'Unauthorized Request' });
                }
            }).catch(err => {
                ////// Error
                res.status(401).json({ ok: 'false', message: 'Unauthorized Request' });
            });
        }
    } else {
        ////// Error
        res.status(401).json({ ok: 'false', message: 'Unauthorized Request' });
    }
}