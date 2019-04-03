import { Router } from 'express';

import { AuthenticateGuard, StoreGuard } from '../middlewares/store';

import * as ListController from '../controllers/store/list';
import * as DocumentController from '../controllers/store/document';

const router = Router();

router.get("/list", ListController.listStores);

router.get("/db/:db_name/:id",
    AuthenticateGuard,
    StoreGuard,
    DocumentController.getDocument
);

router.post("/db/:db_name",
    AuthenticateGuard,
    StoreGuard,
    DocumentController.createDocument
);

router.put("/db/:db_name/:id",
    AuthenticateGuard,
    StoreGuard,
    DocumentController.updateDocument
);

router.delete("/db/:db_name/:id",
    AuthenticateGuard,
    StoreGuard,
    DocumentController.deleteDocument
);

router.get("/db/:db_name",
    AuthenticateGuard,
    StoreGuard,
    DocumentController.queryDocuments
);

module.exports = router;