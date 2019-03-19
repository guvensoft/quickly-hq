import { Router } from 'express';

import { AuthenticateGuard, StoreGuard } from '../middlewares/store';

import * as ListController from '../controllers/store/list';
import * as DocumentController from '../controllers/store/document';

const router = Router();

router.get("/list", ListController.listStores);

router.get("/get/:id",
    AuthenticateGuard,
    StoreGuard,
    DocumentController.getDocument
);

router.post("/post",
    AuthenticateGuard,
    StoreGuard,
    DocumentController.createDocument
);

router.put("/put/:id",
    AuthenticateGuard,
    StoreGuard,
    DocumentController.updateDocument
);

router.delete("/delete/:id",
    AuthenticateGuard,
    StoreGuard,
    DocumentController.deleteDocument
);

router.get("/query/:db_name",
    AuthenticateGuard,
    StoreGuard,
    DocumentController.queryDocuments
);

module.exports = router;