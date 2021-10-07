import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { GroupMessages } from '../../utils/messages';
import { UserGroup } from "../../models/store/user";
import { createReport } from "../../functions/store/reports";

////// /users_group [POST]
export const createGroup = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        let GroupWillCreate:UserGroup  = { db_name: 'users_group', db_seq: 0, ...req.body };
        let Group = await StoresDB.post(GroupWillCreate);
        GroupWillCreate._id = Group.id;
        GroupWillCreate._rev = Group.rev;
        let GroupReport = { db_name: 'reports', db_seq: 0, ...createReport('Group', GroupWillCreate) }
        const isCreated = await StoresDB.post(GroupReport)
        if (isCreated && Group.ok) {
            res.status(GroupMessages.GROUP_CREATED.code).json(GroupMessages.GROUP_CREATED.response);
        } else {
            res.status(GroupMessages.GROUP_NOT_CREATED.code).json(GroupMessages.GROUP_NOT_CREATED.response);
        }
    } catch (error) {
        res.status(GroupMessages.GROUP_NOT_CREATED.code).json(GroupMessages.GROUP_NOT_CREATED.response);
    }
}

////// /users_group/id [DELETE]
export const deleteGroup = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Group = await StoresDB.get(req.params.id);
        const GroupReport = await StoresDB.find({ selector: { db_name: 'reports', connection_id: Group._id } });
        StoresDB.remove(Group);
        StoresDB.remove(GroupReport.docs[0]);
        res.status(GroupMessages.GROUP_DELETED.code).json(GroupMessages.GROUP_DELETED.response);
    } catch (error) {
        res.status(GroupMessages.GROUP_NOT_DELETED.code).json(GroupMessages.GROUP_NOT_DELETED.response);
    }

}

////// /users_group/id [PUT]
export const updateGroup = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Group = await StoresDB.get(req.params.id);
        await StoresDB.put({ Group, ...req.body });
        res.status(GroupMessages.GROUP_CREATED.code).json(GroupMessages.GROUP_CREATED.response);
    } catch (error) {
        res.status(GroupMessages.GROUP_NOT_CREATED.code).json(GroupMessages.GROUP_NOT_CREATED.response);
    }

}

////// /users_group/id [GET]
export const getGroup = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Group = await StoresDB.get(req.params.id);
        res.json(Group);
    } catch (error) {
        res.status(GroupMessages.GROUP_NOT_CREATED.code).json(GroupMessages.GROUP_NOT_CREATED.response);
    }
}

////// /users_groups + QueryString [GET]
export const queryGroups = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Groups = await StoresDB.find({ selector: { db_name: 'users_group', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Groups.docs);
    } catch (error) {
        res.status(GroupMessages.GROUP_NOT_EXIST.code).json(GroupMessages.GROUP_NOT_EXIST.response);
    }
}