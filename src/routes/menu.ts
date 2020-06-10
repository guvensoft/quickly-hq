import { Router } from 'express';

import * as MenuController from '../controllers/menu/menu';

const router = Router();

router.get("/:store", MenuController.requestMenu);

router.post("/order")

module.exports = router;