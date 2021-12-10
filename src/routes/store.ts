import { Router } from 'express';

import { StoreAuthenticateGuard, StoreGuard, AccountGuard } from '../middlewares/store';
import { SchemaGuard } from '../middlewares/management'

import * as ListController from '../controllers/store/general';
import * as DocumentController from '../controllers/store/document';
import * as StoreAuthController from '../controllers/store/authentication';
import * as StoreReportsController from '../controllers/store/reports';
import * as StoreMenuController from '../controllers/store/menu';
import * as StoreOrderController from '../controllers/store/orders';
import * as StoreReceiptController from '../controllers/store/receipts';
import * as StoreEndofdayController from '../controllers/store/endofday';
import * as StoreCashboxController from '../controllers/store/cashbox';

import { AuthSchemaSafe } from '../schemas/management';
import * as StoreSchema from '../schemas/store';

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
router.post("/refresh",
    StoreAuthenticateGuard,
    StoreAuthController.Refresh
);

/// Store Endday
router.post("/endday",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreEndofdayController.endDayProcess
);
router.post("/backup",
    StoreGuard,
    StoreEndofdayController.uploadBackup
);

// Store General Controllers
router.get("/list",
    StoreAuthenticateGuard,
    ListController.listStores
);
router.get("/info",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    ListController.storeInfo
);
router.get("/infos",
    StoreAuthenticateGuard,
    ListController.storesInfo
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

/// Store Menu Controller
router.get("/menu/:store",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreMenuController.requestMenu);

router.post("/menu/:store",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreMenuController.saveMenu);

router.post("/menu/upload/:store",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreMenuController.uploadPicture);


/// Store Order Controller
router.post("/order/accept",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreOrderController.acceptOrder);

router.post("/order/approovee",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreOrderController.approoveOrder);

router.post("/order/cancel",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreOrderController.cancelOrder);


/// Store Receipt Controller
router.post("/receipt/accept",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreReceiptController.acceptReceipt);

router.post("/receipt/approovee",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreReceiptController.approoveReceipt);

router.post("/receipt/cancel",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreReceiptController.cancelReceipt);


// Store CashboxController
router.get("/cashbox/:id",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreCashboxController.getCashboxEntry);

router.post("/cashbox",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    SchemaGuard(StoreSchema.CashboxSchema),
    StoreCashboxController.createCashboxEntry);

router.put("/cashbox/:id",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    SchemaGuard(StoreSchema.CashboxSchemaSafe),
    StoreCashboxController.updateCashboxEntry);

router.delete("/cashbox/:id",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreCashboxController.deleteCashboxEntry);

router.get("/cashbox",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    StoreCashboxController.queryCashboxEntries);

module.exports = router;