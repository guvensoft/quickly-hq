import { Response, Request } from "express";
import { ManagementDB, DatabaseQueryLimit } from "../../configrations/database";
import { SessionMessages } from '../../utils/messages';
import { createLog, LogType } from '../../utils/logger';
import { Session } from "../../models/management/session";


//////  /session [POST]
export const createSession = (req: Request, res: Response) => {
    let newSession: Session = req.body;
    // ManagementDB.Sessions.find({ selector: { name: newSession.name } }).then(sessions => {
    //     if (sessions.docs.length > 0) {
    //         res.status(SessionMessages.SESSION_EXIST.code).json(SessionMessages.SESSION_EXIST.response);
    //     } else {
    //         newSession.timestamp = Date.now();
    //         ManagementDB.Sessions.post(newSession).then(db_res => {
    //             res.status(SessionMessages.SESSION_CREATED.code).json(SessionMessages.SESSION_CREATED.response);
    //         }).catch((err) => {
    //             res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
    //             createLog(req, LogType.DATABASE_ERROR, err);
    //         })
    //     }
    // }).catch((err) => {
    //     res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
    //     createLog(req, LogType.DATABASE_ERROR, err);
    // });
};

//////  /session/:id [PUT]
export const updateSession = (req: Request, res: Response) => {
    let sessionID = req.params.id;
    let formData = req.body;
    ManagementDB.Sessions.get(sessionID).then(obj => {
        ManagementDB.Sessions.put(Object.assign(obj, formData)).then(() => {
            res.status(SessionMessages.SESSION_UPDATED.code).json(SessionMessages.SESSION_UPDATED.response);
        }).catch(err => {
            res.status(SessionMessages.SESSION_NOT_UPDATED.code).json(SessionMessages.SESSION_NOT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(SessionMessages.SESSION_NOT_EXIST.code).json(SessionMessages.SESSION_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /session/:id [GET]
export const getSession = (req: Request, res: Response) => {
    let sessionID = req.params.id;
    ManagementDB.Sessions.get(sessionID).then((obj: any) => {
        res.send(obj);
    }).catch(err => {
        res.status(SessionMessages.SESSION_NOT_EXIST.code).json(SessionMessages.SESSION_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /session/:id [DELETE]
export const deleteSession = (req: Request, res: Response) => {
    let sessionID = req.params.id;
    ManagementDB.Sessions.get(sessionID).then(obj => {
        ManagementDB.Sessions.remove(obj).then(() => {
            res.status(SessionMessages.SESSION_DELETED.code).json(SessionMessages.SESSION_DELETED.response);
        }).catch(err => {
            res.status(SessionMessages.SESSION_NOT_DELETED.code).json(SessionMessages.SESSION_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(SessionMessages.SESSION_NOT_EXIST.code).json(SessionMessages.SESSION_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /sessions + QueryString [GET]
export const querySessions = (req: Request, res: Response) => {
    let qRegex = req.query.regex;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    if (qRegex) {
        req.query.name = JSON.parse(req.query.name);
        delete req.query.regex;
    }
    ManagementDB.Sessions.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        res.status(SessionMessages.SESSION_NOT_EXIST.code).json(SessionMessages.SESSION_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};