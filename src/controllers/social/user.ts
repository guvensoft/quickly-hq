import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { DatabaseQueryLimit, SocialDB } from "../../configrations/database";
import { SocialUser } from "../../models/social/users";
import { createLog, LogType } from '../../utils/logger';
import { UserMessages } from '../../utils/messages';

//////  /user [POST]
export const createUser = (req: Request, res: Response) => {
	let newUser: SocialUser = req.body;
	SocialDB.Users.find({ selector: { username: newUser.username } }).then(user => {
		if (user.docs.length > 0) {
			res.status(UserMessages.USER_EXIST.code).json(UserMessages.USER_EXIST.response);
		} else {
			bcrypt.genSalt(10, (err, salt) => {
				if (!err) {
					bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
						if (!err) {
							newUser.password = hashedPassword;
							newUser.timestamp = Date.now();
							SocialDB.Users.post(newUser).then(() => {
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

//////  /user/:id [PUT]
export const updateUser = (req: Request, res: Response) => {
	let userID = req.params.id;
	let formData = req.body;
	SocialDB.Users.get(userID).then(obj => {
		SocialDB.Users.put(Object.assign(obj, formData)).then(() => {
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

//////  /user/:id [GET]
export const getUser = (req: Request, res: Response) => {
	let userID = req.params.id;
	SocialDB.Users.get(userID).then((obj: any) => {
		res.send(obj);
	}).catch(err => {
		res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
}

//////  /user/:id [DELETE]
export const deleteUser = (req: Request, res: Response) => {
	let userID = req.params.id;
	SocialDB.Users.get(userID).then(obj => {
		SocialDB.Users.remove(obj).then(() => {
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

//////  /users + QueryString [GET]
export const queryUsers = (req: Request, res: Response) => {
	let qLimit = req.query.limit || DatabaseQueryLimit;
	let qSkip = req.query.skip || 0;
	delete req.query.skip;
	delete req.query.limit;
	SocialDB.Users.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
		res.send(obj.docs);
	}).catch(err => {
		res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
};