import { Router } from 'express';
import { StoreAuthenticateGuard, StoreGuard, AccountGuard } from '../middlewares/store';

import * as MenuController from '../controllers/menu/menu';

const router = Router();

router.get("/:store", MenuController.requestMenu);

router.post("/upload/:store",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    MenuController.uploadPicture);

router.post("/:store",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    MenuController.saveMenu);

module.exports = router;