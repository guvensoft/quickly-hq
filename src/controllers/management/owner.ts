import { Response, Request } from "express";
import * as bcrypt from "bcrypt";
import { ManagementDB, DatabaseQueryLimit } from "../../configrations/database";
import { OwnerMessages } from '../../utils/messages';
import { createLog, LogType } from '../../utils/logger';
import { Owner } from "../../models/management/owner";
import { sendSms } from "../../configrations/sms";


//////  /owner [POST]
export const createOwner = (req: Request, res: Response) => {
	let newOwner: Owner = req.body;
	ManagementDB.Owners.find({ selector: { username: newOwner.username } }).then(user => {
		if (user.docs.length > 0) {
			res.status(OwnerMessages.OWNER_EXIST.code).json(OwnerMessages.OWNER_EXIST.response);
		} else {
			sendSms(newOwner.phone_number.toString(),`Kullanıcı Adı: ${newOwner.username}                              Şifre: ${newOwner.password}                              ---------------------------`)
			bcrypt.genSalt(10, (err, salt) => {
				if (!err) {
					bcrypt.hash(newOwner.password, salt, (err, hashedPassword) => {
						if (!err) {
							newOwner.password = hashedPassword;
							newOwner.timestamp = Date.now();
							ManagementDB.Owners.post(newOwner).then(() => {
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

//////  /owner/:id [PUT]
export const updateOwner = (req: Request, res: Response) => {
	let ownerID = req.params.id;
	let formData = req.body;
	ManagementDB.Owners.get(ownerID).then(obj => {
		ManagementDB.Owners.put(Object.assign(obj, formData)).then(() => {
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

//////  /owner/:id [GET]
export const getOwner = (req: Request, res: Response) => {
	let ownerID = req.params.id;
	ManagementDB.Owners.get(ownerID).then((obj: Owner) => {
		res.send(obj);
	}).catch(err => {
		res.status(OwnerMessages.OWNER_NOT_EXIST.code).json(OwnerMessages.OWNER_NOT_EXIST.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
}

//////  /owner/:id [DELETE]
export const deleteOwner = (req: Request, res: Response) => {
	let ownerID = req.params.id;
	ManagementDB.Owners.get(ownerID).then(obj => {
		ManagementDB.Owners.remove(obj).then(() => {
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

//////  /owners + QueryString [GET]
export const queryOwners = (req: Request, res: Response) => {
	let qLimit = req.query.limit || DatabaseQueryLimit;
	let qSkip = req.query.skip || 0;
	delete req.query.skip;
	delete req.query.limit;
	ManagementDB.Owners.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
		res.send(obj.docs);
	}).catch(err => {
		res.status(OwnerMessages.OWNER_NOT_EXIST.code).json(OwnerMessages.OWNER_NOT_EXIST.response);
		createLog(req, LogType.DATABASE_ERROR, err);
	});
};