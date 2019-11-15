import { Router } from 'express';

import * as ProducerController from '../controllers/management/producer';
import * as ProductController from '../controllers/management/product';
import * as SupplierController from '../controllers/management/supplier';

import { StoreAuthenticateGuard } from '../middlewares/store';

const router = Router();

router.get("/products",
    StoreAuthenticateGuard,
    ProductController.queryProducts
)

router.get("/producers",
    StoreAuthenticateGuard,
    ProducerController.queryProducers
)

router.get("/suppliers",
    StoreAuthenticateGuard,
    SupplierController.querySuppliers
)

module.exports = router;