import { Response, Request } from "express";
import { ManagementDB } from "../databases/management";
import { UserGroup } from "../models/management/users";
import { GroupMessages } from "../utils/messages";
import { createLog, LogType } from '../utils/logger';

export const createGroup = (req: Request, res: Response) => {
    let formData = req.body;
    ManagementDB.Groups.find({ selector: { name: formData.name } }).then(group => {
        if (group.docs.length > 0) {
            res.status(GroupMessages.GROUP_EXIST.code).json(GroupMessages.GROUP_EXIST.response);
        } else {
            let userGroup = new UserGroup(formData.name, formData.description, Date.now(), (formData.canRead ? true : false), (formData.canWrite ? true : false), (formData.canEdit ? true : false), (formData.canDelete ? true : false));
            ManagementDB.Groups.post(userGroup).then(db_res => {
                res.status(GroupMessages.GROUP_CREATED.code).json(GroupMessages.GROUP_CREATED.response);
            }).catch((err) => {
                createLog(req, LogType.DATABASE_ERROR, err);
                res.status(GroupMessages.GROUP_NOT_CREATED.code).json(GroupMessages.GROUP_NOT_CREATED.response);
            })
        }
    }).catch((err) => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(GroupMessages.GROUP_NOT_CREATED.code).json(GroupMessages.GROUP_NOT_CREATED.response);
    });
};

export const updateGroup = (req: Request, res: Response) => {
    let groupID = req.params.id;
    let formData = req.body;
    ManagementDB.Groups.get(groupID).then(obj => {
        ManagementDB.Groups.put(Object.assign(obj, formData)).then(db_res => {
            res.status(GroupMessages.GROUP_UPDATED.code).json(GroupMessages.GROUP_UPDATED.response);
        }).catch((err) => {
            createLog(req, LogType.DATABASE_ERROR, err);
            res.status(GroupMessages.GROUP_NOT_UPDATED.code).json(GroupMessages.GROUP_NOT_UPDATED.response);
        })
    }).catch((err) => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(GroupMessages.GROUP_NOT_EXIST.code).json(GroupMessages.GROUP_NOT_EXIST.response);
    });
}

export const getGroup = (req: Request, res: Response) => {
    let groupID = req.params.id;
    ManagementDB.Groups.get(groupID).then((obj: any) => {
        res.send(obj);
    }).catch((err) => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(GroupMessages.GROUP_NOT_EXIST.code).json(GroupMessages.GROUP_NOT_EXIST.response);
    });
}

export const deleteGroup = (req: Request, res: Response) => {
    let userID = req.params.id;
    ManagementDB.Groups.get(userID).then(obj => {
        ManagementDB.Groups.remove(obj).then(() => {
        res.status(GroupMessages.GROUP_DELETED.code).json(GroupMessages.GROUP_DELETED.response);
        }).catch((err) => {
            createLog(req, LogType.DATABASE_ERROR, err);
        res.status(GroupMessages.GROUP_NOT_DELETED.code).json(GroupMessages.GROUP_NOT_DELETED.response);
        })
    }).catch((err) => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(GroupMessages.GROUP_NOT_EXIST.code).json(GroupMessages.GROUP_NOT_EXIST.response);
    });
}

export const queryGroups = (req: Request, res: Response) => {
    let qLimit = parseInt(req.query.limit) || 25;
    let qSkip = parseInt(req.query.skip) || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Groups.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch((err) => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.json({ ok: false, message: 'Grup Sorgusunda Hata!' });
    });
};