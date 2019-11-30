import { Request, Response } from "express";
import { DatabaseQueryLimit, ManagementDB } from "../../configrations/database";
import { Group } from "../../models/management/users";
import { createLog, LogType } from '../../utils/logger';
import { GroupMessages } from "../../utils/messages";

//////  /group [POST]
export const createGroup = (req: Request, res: Response) => {
    let newGroup: Group = req.body;
    ManagementDB.Groups.find({ selector: { name: newGroup.name } }).then(group => {
        if (group.docs.length > 0) {
            res.status(GroupMessages.GROUP_EXIST.code).json(GroupMessages.GROUP_EXIST.response);
        } else {
            newGroup.timestamp = Date.now();
            ManagementDB.Groups.post(newGroup).then(() => {
                res.status(GroupMessages.GROUP_CREATED.code).json(GroupMessages.GROUP_CREATED.response);
            }).catch((err) => {
                res.status(GroupMessages.GROUP_NOT_CREATED.code).json(GroupMessages.GROUP_NOT_CREATED.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            })
        }
    }).catch((err) => {
        res.status(GroupMessages.GROUP_NOT_CREATED.code).json(GroupMessages.GROUP_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /group/:id [PUT]
export const updateGroup = (req: Request, res: Response) => {
    let groupID = req.params.id;
    let formData = req.body;
    ManagementDB.Groups.get(groupID).then(obj => {
        ManagementDB.Groups.put(Object.assign(obj, formData)).then(() => {
            res.status(GroupMessages.GROUP_UPDATED.code).json(GroupMessages.GROUP_UPDATED.response);
        }).catch((err) => {
            res.status(GroupMessages.GROUP_NOT_UPDATED.code).json(GroupMessages.GROUP_NOT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(GroupMessages.GROUP_NOT_EXIST.code).json(GroupMessages.GROUP_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /group/:id [GET]
export const getGroup = (req: Request, res: Response) => {
    let groupID = req.params.id;
    ManagementDB.Groups.get(groupID).then((obj: any) => {
        res.send(obj);
    }).catch((err) => {
        res.status(GroupMessages.GROUP_NOT_EXIST.code).json(GroupMessages.GROUP_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /group/:id [DELETE]
export const deleteGroup = (req: Request, res: Response) => {
    let userID = req.params.id;
    ManagementDB.Groups.get(userID).then(obj => {
        ManagementDB.Groups.remove(obj).then(() => {
            res.status(GroupMessages.GROUP_DELETED.code).json(GroupMessages.GROUP_DELETED.response);
        }).catch((err) => {
            res.status(GroupMessages.GROUP_NOT_DELETED.code).json(GroupMessages.GROUP_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(GroupMessages.GROUP_NOT_EXIST.code).json(GroupMessages.GROUP_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /groups + QueryString [GET]
export const queryGroups = (req: Request, res: Response) => {
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Groups.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch((err) => {
        res.status(GroupMessages.GROUP_NOT_EXIST.code).json(GroupMessages.GROUP_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};