import { Router } from 'express';
import { StoreAuthenticateGuard, StoreGuard, AccountGuard } from '../middlewares/store';
import { ReCaptchaCheck } from '../middlewares/menu';

import * as MenuController from '../controllers/menu/menu';

const router = Router();

router.post("/comment/new",
    StoreGuard,
    ReCaptchaCheck,
    MenuController.menuComment);

router.post("/check/:token",
    StoreGuard,
    MenuController.checkRequest);

router.post("/payment/:token",
    StoreGuard,
    MenuController.payReceipt);

router.get("/slug/:slug",
    MenuController.requestMenuFromSlug);

router.get("/:store",
    StoreAuthenticateGuard,
    StoreGuard,
    AccountGuard,
    MenuController.requestMenu);

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