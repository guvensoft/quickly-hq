import { Request, Response } from "express";
import { StoreCollection, DatabaseQueryLimit } from '../../configrations/database';
import { UserMessages, GroupMessages } from '../../utils/messages';
import { Report } from "../../models/store/pos/report.mock";


////// /users/new [POST]
export const createUser = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const UserWillCreate = { db_name: 'users', db_seq: 0, ...req.body };
        const User = await StoreDB.post(UserWillCreate);
        const UserReport = new Report('users', User.id, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], '', Date.now());
        StoreDB.post({ db_name: 'reports', db_seq: 0, ...UserReport });
        res.status(UserMessages.USER_CREATED.code).json(UserMessages.USER_CREATED.response);
    } catch (error) {
        res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
    }
}


////// /users/id [DELETE]
export const deleteUser = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const User = await StoreDB.get(req.params.id);
        const UserReport = await StoreDB.find({ selector: { db_name: 'reports', connection_id: User._id } });
        StoreDB.remove(User);
        StoreDB.remove(UserReport.docs[0]);
        res.status(UserMessages.USER_DELETED.code).json(UserMessages.USER_DELETED.response);
    } catch (error) {
        res.status(UserMessages.USER_NOT_DELETED.code).json(UserMessages.USER_NOT_DELETED.response);
    }

}

////// /users/id [PUT]
export const updateUser = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const User = await StoreDB.get(req.params.id);
        await StoreDB.put({ User, ...req.body });
        res.status(UserMessages.USER_CREATED.code).json(UserMessages.USER_CREATED.response);
    } catch (error) {
        res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
    }

}

////// /users/id [GET]
export const getUser = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const User = await StoreDB.get(req.params.id);
        res.json(User);
    } catch (error) {
        res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
    }
}


////// /users + QueryString [GET]
export const queryUsers = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const Users = await StoreDB.find({ selector: { db_name: 'users', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Users.docs);
    } catch (error) {
        res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
    }
}

////// /users_group/new [POST]
export const createGroup = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const GroupWillCreate = { db_name: 'users_group', db_seq: 0, ...req.body };
        const Group = await StoreDB.post(GroupWillCreate);
        const GroupReport = new Report('users_group', Group.id, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], '', Date.now());
        StoreDB.post(Object.assign(GroupReport, { db_name: 'reports', db_seq: 0 }));
        res.status(GroupMessages.GROUP_CREATED.code).json(GroupMessages.GROUP_CREATED.response);
    } catch (error) {
        res.status(GroupMessages.GROUP_NOT_CREATED.code).json(GroupMessages.GROUP_NOT_CREATED.response);
    }
}

////// /users_group/id [DELETE]
export const deleteGroup = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const Group = await StoreDB.get(req.params.id);
        const GroupReport = await StoreDB.find({ selector: { db_name: 'reports', connection_id: Group._id } });
        StoreDB.remove(Group);
        StoreDB.remove(GroupReport.docs[0]);
        res.status(GroupMessages.GROUP_DELETED.code).json(GroupMessages.GROUP_DELETED.response);
    } catch (error) {
        res.status(GroupMessages.GROUP_NOT_DELETED.code).json(GroupMessages.GROUP_NOT_DELETED.response);
    }

}

////// /users_group/id [PUT]
export const updateGroup = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const Group = await StoreDB.get(req.params.id);
        await StoreDB.put({ Group, ...req.body });
        res.status(GroupMessages.GROUP_CREATED.code).json(GroupMessages.GROUP_CREATED.response);
    } catch (error) {
        res.status(GroupMessages.GROUP_NOT_CREATED.code).json(GroupMessages.GROUP_NOT_CREATED.response);
    }

}

////// /users_group/id [GET]
export const getGroup = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const Group = await StoreDB.get(req.params.id);
        res.json(Group);
    } catch (error) {
        res.status(GroupMessages.GROUP_NOT_CREATED.code).json(GroupMessages.GROUP_NOT_CREATED.response);
    }
}

////// /users_group + QueryString [GET]
export const queryGroups = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const Groups = await StoreDB.find({ selector: { db_name: 'users_group', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Groups.docs);
    } catch (error) {
        res.status(GroupMessages.GROUP_NOT_EXIST.code).json(GroupMessages.GROUP_NOT_EXIST.response);
    }
}