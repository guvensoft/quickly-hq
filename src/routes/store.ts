import { Router } from 'express';

import { StoreAuthenticateGuard, StoreGuard, AccountGuard } from '../middlewares/store';
import { SchemaGuard } from '../middlewares/management'

import * as ListController from '../controllers/store/list';
import * as DocumentController from '../controllers/store/document';
import * as StoreAuthController from '../controllers/store/authentication';

import { AuthSchemaSafe } from '../schemas/management'

const router = Router();

router.get("/list", ListController.listStores);


router.post("/login",
    SchemaGuard(AuthSchemaSafe),
    StoreAuthController.Login
);

router.post("/logout",
    StoreAuthenticateGuard,
    StoreAuthController.Logout
);

router.post("/verify",
    StoreAuthenticateGuard,
    StoreAuthController.Verify
);


router.get("/db/:db_name/:id",
    StoreAuthenticateGuard,
    StoreGuard,
    DocumentController.getDocument
);

router.post("/db/:db_name",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    DocumentController.createDocument
);

router.put("/db/:db_name/:id",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    DocumentController.updateDocument
);

router.delete("/db/:db_name/:id",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    DocumentController.deleteDocument
);

router.get("/db/:db_name",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    DocumentController.queryDocuments
);

module.exports = router;