import { Router } from 'express';
import * as AccountController from '../controllers/account';
import * as AuthController from '../controllers/auth';
import * as DatabaseController from '../controllers/database';
import * as UserController from '../controllers/user';
import * as GroupController from '../controllers/group';
import { AuthenticateGuard } from '../middlewares/auth';

const router = Router();

// Auths
router.post("/auth/login", AuthController.Login);
router.post("/auth/logout", AuthenticateGuard, AuthController.Logout);
router.post("/auth/verify", AuthenticateGuard, AuthController.Verify);

// Accounts
router.post("/account", AuthenticateGuard, AccountController.createAccount);
router.get("/account/:id", AuthenticateGuard, AccountController.getAccount);
router.put("/account/:id", AuthenticateGuard, AccountController.updateAccount);
router.delete("/account/:id", AuthenticateGuard, AccountController.deleteAccount);
router.get("/accounts", AuthenticateGuard, AccountController.queryAccounts);

// Databases 
router.post("/database", AuthenticateGuard, DatabaseController.createDatabase);
router.get("/database/:id", AuthenticateGuard, DatabaseController.getDatabase);
router.put("/database/:id", AuthenticateGuard, DatabaseController.updateDatabase);
router.delete("/database/:id", AuthenticateGuard, DatabaseController.deleteDatabase);
router.get("/databases", AuthenticateGuard, DatabaseController.queryDatabase);
// RemoteDB && CouchDB
router.get("/database/remote/:id", AuthenticateGuard, DatabaseController.listRemoteDB);
router.get("/database/remote/:id/:db", AuthenticateGuard, DatabaseController.openRemoteDB)
// SocialDB
router.get("/database/social/:db", AuthenticateGuard, DatabaseController.getSocialDB);

// Users
router.get("/user/:id", AuthenticateGuard, UserController.getUser);
router.put("/user/:id", AuthenticateGuard, UserController.updateUser);
router.post("/user", AuthenticateGuard, UserController.createUser);
router.delete("/user/:id", AuthenticateGuard, UserController.deleteUser);
router.get("/users", AuthenticateGuard, UserController.queryUsers);

// Groups
router.post("/group", AuthenticateGuard, GroupController.createGroup);
router.get("/group/:id", AuthenticateGuard, GroupController.getGroup);
router.put("/group/:id", AuthenticateGuard, GroupController.updateGroup);
router.delete("/group/:id", AuthenticateGuard, GroupController.deleteGroup);
router.get("/groups", AuthenticateGuard, GroupController.queryGroups);

module.exports = router;