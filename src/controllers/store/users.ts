import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { UserMessages, GroupMessages } from '../../utils/messages';
import { User } from "../../models/store/user";
import { createReport } from "../../functions/store/reports";


////// /user [POST]
export const createUser = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        let UserWillCreate: User = { db_name: 'users', db_seq: 0, ...req.body };
        let User = await StoresDB.post(UserWillCreate);
        UserWillCreate._id = User.id;
        UserWillCreate._rev = User.rev;
        let UserReport = { db_name: 'reports', db_seq: 0, ...createReport('User', UserWillCreate) }
        const isCreated = await StoresDB.post(UserReport)
        if (isCreated && User.ok) {
            res.status(UserMessages.USER_CREATED.code).json(UserMessages.USER_CREATED.response);
        } else {
            res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
        }
    } catch (error) {
        res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
    }
}

////// /user/:id [DELETE]
export const deleteUser = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const User = await StoresDB.get(req.params.id);
        const UserReport = await StoresDB.find({ selector: { db_name: 'reports', connection_id: User._id } });
        StoresDB.remove(User);
        StoresDB.remove(UserReport.docs[0]);
        res.status(UserMessages.USER_DELETED.code).json(UserMessages.USER_DELETED.response);
    } catch (error) {
        res.status(UserMessages.USER_NOT_DELETED.code).json(UserMessages.USER_NOT_DELETED.response);
    }

}

////// /user/:id [PUT]
export const updateUser = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const User = await StoresDB.get(req.params.id);
        await StoresDB.put({ User, ...req.body });
        res.status(UserMessages.USER_CREATED.code).json(UserMessages.USER_CREATED.response);
    } catch (error) {
        res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
    }

}

////// /user/:id [GET]
export const getUser = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const User = await StoresDB.get(req.params.id);
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
        const StoresDB = await StoreDB(StoreID);
        const Users = await StoresDB.find({ selector: { db_name: 'users', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Users.docs);
    } catch (error) {
        res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
    }
}