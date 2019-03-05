import { Router } from 'express';

import * as AuthController from '../controllers/management/auth';
import * as UserController from '../controllers/management/user';
import * as GroupController from '../controllers/management/group';
import * as StoreController from '../controllers/management/store';
import * as AccountController from '../controllers/management/account';
import * as DatabaseController from '../controllers/management/database';

import { AuthenticateGuard } from '../middlewares/auth';
import { SchemaGuard } from '../middlewares/sanitizer';

import * as Schema from '../utils/schemas';

const router = Router();

// Auths
router.post("/auth/login",
    SchemaGuard(Schema.AuthSchemaSafe),
    AuthController.Login);

router.post("/auth/logout",
    AuthenticateGuard,
    AuthController.Logout);

router.post("/auth/verify",
    AuthenticateGuard,
    AuthController.Verify);

// Accounts
router.get("/account/:id",
    AuthenticateGuard,
    AccountController.getAccount);

router.post("/account",
    AuthenticateGuard,
    SchemaGuard(Schema.AccountSchemaSafe),
    AccountController.createAccount);

router.put("/account/:id",
    AuthenticateGuard,
    SchemaGuard(Schema.AccountSchema),
    AccountController.updateAccount);

router.delete("/account/:id",
    AuthenticateGuard,
    AccountController.deleteAccount);

router.get("/accounts",
    AuthenticateGuard,
    AccountController.queryAccounts);

// Databases 
router.get("/database/:id",
    AuthenticateGuard,
    DatabaseController.getDatabase);

router.post("/database",
    AuthenticateGuard,
    SchemaGuard(Schema.DatabaseSchemaSafe),
    DatabaseController.createDatabase);

router.put("/database/:id",
    AuthenticateGuard,
    SchemaGuard(Schema.DatabaseSchema),
    DatabaseController.updateDatabase);

router.delete("/database/:id",
    AuthenticateGuard,
    DatabaseController.deleteDatabase);

router.get("/databases",
    AuthenticateGuard,
    DatabaseController.queryDatabases);

// RemoteDB
router.get("/database/remote/:id",
    AuthenticateGuard,
    DatabaseController.listRemoteDB);

router.get("/database/remote/:id/:db",
    AuthenticateGuard,
    DatabaseController.openRemoteDB)

router.put("/database/remote/:id/:db",
    AuthenticateGuard,
    DatabaseController.createCollectionDB);

router.get("/database/social/:db",
    AuthenticateGuard,
    DatabaseController.getSocialDB);

// Users
router.get("/user/:id",
    AuthenticateGuard,
    UserController.getUser);

router.post("/user",
    AuthenticateGuard,
    SchemaGuard(Schema.UserSchemaSafe),
    UserController.createUser);

router.put("/user/:id",
    AuthenticateGuard,
    SchemaGuard(Schema.UserSchema),
    UserController.updateUser);

router.delete("/user/:id",
    AuthenticateGuard,
    UserController.deleteUser);

router.get("/users",
    AuthenticateGuard,
    UserController.queryUsers);

// Groups
router.get("/group/:id",
    AuthenticateGuard,
    GroupController.getGroup);

router.post("/group",
    AuthenticateGuard,
    SchemaGuard(Schema.GroupSchemaSafe),
    GroupController.createGroup);

router.put("/group/:id",
    AuthenticateGuard,
    SchemaGuard(Schema.GroupSchema),
    GroupController.updateGroup);

router.delete("/group/:id",
    AuthenticateGuard,
    GroupController.deleteGroup);

router.get("/groups",
    AuthenticateGuard,
    GroupController.queryGroups);

// Stores
router.get("/store/:id",
    AuthenticateGuard,
    StoreController.getStore);

router.post("/store",
    AuthenticateGuard,
    SchemaGuard(Schema.AccountSchemaSafe),
    StoreController.createStore);

router.put("/store/:id",
    AuthenticateGuard,
    SchemaGuard(Schema.AccountSchema),
    StoreController.updateStore);

router.delete("/store/:id",
    AuthenticateGuard,
    StoreController.deleteStore);

router.get("/stores",
    AuthenticateGuard,
    StoreController.queryStores);
    
// Utils
router.get("/images/:text",
    StoreController.getImage);

router.get("/venues/:text",
    StoreController.getVenues);

module.exports = router;