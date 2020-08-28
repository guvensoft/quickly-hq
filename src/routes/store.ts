import { Router } from 'express';

import { StoreAuthenticateGuard, StoreGuard, AccountGuard } from '../middlewares/store';
import { SchemaGuard } from '../middlewares/management'

import * as ListController from '../controllers/store/general';
import * as DocumentController from '../controllers/store/document';
import * as StoreAuthController from '../controllers/store/authentication';
import * as StoreReportsController from '../controllers/store/reports';
import * as StoreMenuController from '../controllers/store/menus';

import * as ProductsController from '../controllers/management/product';

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

router.get("/menus",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreMenuController.queryMenus
);

// Store Client Reports
router.get("/reports/products/:start?/:end?",
    StoreAuthenticateGuard,
    StoreReportsController.getProductReports
);

router.get("/reports/users/:start?/:end?",
    StoreAuthenticateGuard,
    StoreReportsController.getUserReports
);

router.get("/reports/tables/:start?/:end?",
    StoreAuthenticateGuard,
    StoreReportsController.getTableReports
);

router.get("/reports/activities/:start?/:end?",
    StoreAuthenticateGuard,
    StoreReportsController.getActivityReports
);

router.get("/reports/sales/:start?/:end?",
    StoreAuthenticateGuard,
    StoreReportsController.getSalesReports
);

router.get("/reports/day/:start?/:end?",
    StoreAuthenticateGuard,
    StoreReportsController.getDailyReports
);

// router.get("/reports/:start?/:end?",
//     StoreAuthenticateGuard,
//     StoreReportsController.getDurationReports
// );



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