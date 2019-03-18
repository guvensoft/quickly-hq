import { Response, Request } from "express";
import * as bcrypt from "bcrypt";
import { ManagementDB } from "../../configrations/database";
import { User } from "../../models/management/users";
import { UserMessages } from '../../utils/messages';
import { createLog, LogType } from '../../utils/logger';

export const createUser = (req: Request, res: Response) => {
	let newUser: User = req.body;
	ManagementDB.Users.find({ selector: { username: newUser.username } }).then(user => {
		if (user.docs.length > 0) {
			res.status(UserMessages.USER_EXIST.code).json(UserMessages.USER_EXIST.response);
		} else {
			bcrypt.genSalt(10, (err, salt) => {
				if (!err) {
					bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
						if (!err) {
							newUser.password = hashedPassword;
							newUser.timestamp = Date.now();
							ManagementDB.Users.post(newUser).then(() => {
								res.status(UserMessages.USER_CREATED.code).json(UserMessages.USER_CREATED.response);
							}).catch(err => {
								res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
								createLog(req, LogType.DATABASE_ERROR, err);
							});
						} else {
							res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
							createLog(req, LogType.INNER_LIBRARY_ERROR, err);
						}
					});
				} else {
					res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
					createLog(req, LogType.INNER_LIBRARY_ERROR, err);
				}
			});
		}
	}).catch(err => {
		res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
};

export const updateUser = (req: Request, res: Response) => {
	let userID = req.params.id;
	let formData = req.body;
	ManagementDB.Users.get(userID).then(obj => {
		ManagementDB.Users.put(Object.assign(obj, formData)).then(() => {
			res.status(UserMessages.USER_UPDATED.code).json(UserMessages.USER_UPDATED.response);
		}).catch(err => {
			res.status(UserMessages.USER_NOT_UPDATED.code).json(UserMessages.USER_NOT_UPDATED.response);
			createLog(req, LogType.DATABASE_ERROR, err);
		})
	}).catch(err => {
		res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
}

export const getUser = (req: Request, res: Response) => {
	let userID = req.params.id;
	ManagementDB.Users.get(userID).then((obj: any) => {
		res.send(obj);
	}).catch(err => {
		res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
}

export const deleteUser = (req: Request, res: Response) => {
	let userID = req.params.id;
	ManagementDB.Users.get(userID).then(obj => {
		ManagementDB.Users.remove(obj).then(() => {
			res.status(UserMessages.USER_DELETED.code).json(UserMessages.USER_DELETED.response);
		}).catch(err => {
			res.status(UserMessages.USER_NOT_DELETED.code).json(UserMessages.USER_NOT_DELETED.response);
			createLog(req, LogType.DATABASE_ERROR, err);
		})
	}).catch(err => {
		res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
}

export const queryUsers = (req: Request, res: Response) => {
	let qLimit = parseInt(req.query.limit) || 25;
	let qSkip = parseInt(req.query.skip) || 0;
	delete req.query.skip;
	delete req.query.limit;
	ManagementDB.Users.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
		res.send(obj.docs);
	}).catch(err => {
		res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
};