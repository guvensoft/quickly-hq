import { Response, Request } from "express";
import * as bcrypt from "bcrypt";
import { ManagementDB } from "../databases/management";
import { User } from "../models/management/users";
import { UserMessages } from '../utils/messages';

export const createUser = (req: Request, res: Response) => {
	let formData = req.body;
	ManagementDB.Users.find({ selector: { username: formData.username } }).then(user => {
		if (user.docs.length > 0) {
			res.status(UserMessages.USER_EXIST.code).json(UserMessages.USER_EXIST.response);
		} else {
			bcrypt.genSalt(10, (err, salt) => {
				if (!err) {
					bcrypt.hash(formData.password, salt, (err, hashString) => {
						if (!err) {
							let newUser = new User(formData.username, hashString, formData.fullname, formData.email, formData.phone_number, Date.now(), '', formData.group);
							ManagementDB.Users.post(newUser).then(db_res => {
								res.status(UserMessages.USER_CREATED.code).json(UserMessages.USER_CREATED.response);
							}).catch(err => {
								////// Error
								console.error('Database Error')
								res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
							});
						} else {
							////// Error
							console.error('Bcrypt Error', err)
							res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
						}
					});
				} else {
					////// Error
					console.error('Bcrypt Error', err)
					res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
				}
			});
		}
	}).catch(err => {
		////// Error
		res.status(UserMessages.USER_NOT_CREATED.code).json(UserMessages.USER_NOT_CREATED.response);
	});
};

export const updateUser = (req: Request, res: Response) => {
	let userID = req.params.id;
	let formData = req.body;
	ManagementDB.Users.get(userID).then(obj => {
		ManagementDB.Users.put(formData).then(db_res => {
			res.status(UserMessages.USER_UPDATED.code).json(UserMessages.USER_UPDATED.response);
		}).catch(err => {
			////// Error
			res.status(UserMessages.USER_NOT_UPDATED.code).json(UserMessages.USER_NOT_UPDATED.response);
		})
	}).catch(err => {
		////// Error
		res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
	});
}

export const getUser = (req: Request, res: Response) => {
	let userID = req.params.id;
	ManagementDB.Users.get(userID).then((obj: any) => {
		res.send(obj.doc);
	}).catch(err => {
		////// Error
		res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
	});
}

export const deleteUser = (req: Request, res: Response) => {
	let userID = req.params.id;
	ManagementDB.Users.get(userID).then(obj => {
		ManagementDB.Users.remove(obj).then(db_res => {
			res.status(UserMessages.USER_DELETED.code).json(UserMessages.USER_DELETED.response);
		}).catch(err => {
			////// Error
			res.status(UserMessages.USER_NOT_DELETED.code).json(UserMessages.USER_NOT_DELETED.response);
		})
	}).catch(err => {
		////// Error
		res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
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
		////// Error
		res.json(err);
		// res.status(UserMessages.USER_NOT_EXIST.code).json(UserMessages.USER_NOT_EXIST.response);
	});
};