import { Response, Request } from "express";
import * as bcrypt from "bcrypt";
import { StoreDB } from "../../configrations/database";
import { OwnerMessages } from '../../utils/messages';
import { createLog, LogType } from '../../utils/logger';
import { Owner } from "../../models/store/owner";

export const createOwner = (req: Request, res: Response) => {
	let newUser: Owner = req.body;
	StoreDB.Owners.find({ selector: { username: newUser.username } }).then(user => {
		if (user.docs.length > 0) {
			res.status(OwnerMessages.OWNER_EXIST.code).json(OwnerMessages.OWNER_EXIST.response);
		} else {
			bcrypt.genSalt(10, (err, salt) => {
				if (!err) {
					bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
						if (!err) {
							newUser.password = hashedPassword;
							newUser.timestamp = Date.now();
							StoreDB.Owners.post(newUser).then(() => {
								res.status(OwnerMessages.OWNER_CREATED.code).json(OwnerMessages.OWNER_CREATED.response);
							}).catch(err => {
								res.status(OwnerMessages.OWNER_NOT_CREATED.code).json(OwnerMessages.OWNER_NOT_CREATED.response);
								createLog(req, LogType.DATABASE_ERROR, err);
							});
						} else {
							res.status(OwnerMessages.OWNER_NOT_CREATED.code).json(OwnerMessages.OWNER_NOT_CREATED.response);
							createLog(req, LogType.INNER_LIBRARY_ERROR, err);
						}
					});
				} else {
					res.status(OwnerMessages.OWNER_NOT_CREATED.code).json(OwnerMessages.OWNER_NOT_CREATED.response);
					createLog(req, LogType.INNER_LIBRARY_ERROR, err);
				}
			});
		}
	}).catch(err => {
		res.status(OwnerMessages.OWNER_NOT_CREATED.code).json(OwnerMessages.OWNER_NOT_CREATED.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
};

export const updateOwner = (req: Request, res: Response) => {
	let ownerID = req.params.id;
	let formData = req.body;
	StoreDB.Owners.get(ownerID).then(obj => {
		StoreDB.Owners.put(Object.assign(obj, formData)).then(() => {
			res.status(OwnerMessages.OWNER_UPDATED.code).json(OwnerMessages.OWNER_UPDATED.response);
		}).catch(err => {
			res.status(OwnerMessages.OWNER_NOT_UPDATED.code).json(OwnerMessages.OWNER_NOT_UPDATED.response);
			createLog(req, LogType.DATABASE_ERROR, err);
		})
	}).catch(err => {
		res.status(OwnerMessages.OWNER_NOT_EXIST.code).json(OwnerMessages.OWNER_NOT_EXIST.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
}

export const getOwner = (req: Request, res: Response) => {
	let ownerID = req.params.id;
	StoreDB.Owners.get(ownerID).then((obj: any) => {
		res.send(obj);
	}).catch(err => {
		res.status(OwnerMessages.OWNER_NOT_EXIST.code).json(OwnerMessages.OWNER_NOT_EXIST.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
}

export const deleteOwner = (req: Request, res: Response) => {
	let ownerID = req.params.id;
	StoreDB.Owners.get(ownerID).then(obj => {
		StoreDB.Owners.remove(obj).then(() => {
			res.status(OwnerMessages.OWNER_DELETED.code).json(OwnerMessages.OWNER_DELETED.response);
		}).catch(err => {
			res.status(OwnerMessages.OWNER_NOT_DELETED.code).json(OwnerMessages.OWNER_NOT_DELETED.response);
			createLog(req, LogType.DATABASE_ERROR, err);
		})
	}).catch(err => {
		res.status(OwnerMessages.OWNER_NOT_EXIST.code).json(OwnerMessages.OWNER_NOT_EXIST.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
}

export const queryOwners = (req: Request, res: Response) => {
	let qLimit = req.query.limit || 25;
	let qSkip = req.query.skip || 0;
	delete req.query.skip;
	delete req.query.limit;
	StoreDB.Owners.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
		res.send(obj.docs);
	}).catch(err => {
		res.status(OwnerMessages.OWNER_NOT_EXIST.code).json(OwnerMessages.OWNER_NOT_EXIST.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
};