import { Router } from 'express';

import { StoreAuthenticateGuard, StoreGuard, AccountGuard } from '../middlewares/store';
import { SchemaGuard } from '../middlewares/management'

import * as ListController from '../controllers/store/general';
import * as DocumentController from '../controllers/store/document';
import * as StoreAuthController from '../controllers/store/authentication';
import * as StoreReportsController from '../controllers/store/reports';

import { AuthSchemaSafe } from '../schemas/management'

const router = Router();


// Store Auth Controllers
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


// Store General Controllers
router.get("/list",
    StoreAuthenticateGuard,
    ListController.listStores
);

router.get("/info",
    StoreAuthenticateGuard,
    ListController.storesInfo
);


// Store Client Reports
router.get("/reports/products",
    StoreAuthenticateGuard,
    StoreReportsController.getProductReports
);

router.get("/reports/users",
    StoreAuthenticateGuard,
    StoreReportsController.getUserReports
);

router.get("/reports/tables",
    StoreAuthenticateGuard,
    StoreReportsController.getTableReports
);

router.get("/reports/activities",
    StoreAuthenticateGuard,
    StoreReportsController.getActivityReports
);

router.get("/reports/sales",
    StoreAuthenticateGuard,
    StoreReportsController.getSalesReports
);


// Store Documents Controller
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