import { Router } from 'express';
import { StoreAuthenticateGuard, StoreGuard, AccountGuard } from '../middlewares/store';
import { ReCaptchaCheck } from '../middlewares/menu';

import * as MenuController from '../controllers/menu/menu';

const router = Router();

router.post("/comment/new",
    StoreGuard,
    ReCaptchaCheck,
    MenuController.menuComment);

router.post("/check/:check",
    StoreGuard,
    MenuController.checkRequest);

router.get("/:slug",
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