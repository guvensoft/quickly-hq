import { Router } from 'express';

import * as ProducerController from '../controllers/management/producer';
import * as ProductController from '../controllers/management/product';
import * as SupplierController from '../controllers/management/supplier';
import * as CategoryController from '../controllers/management/category';
import * as BrandController from '../controllers/management/brand';

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

router.get("/brands",
    StoreAuthenticateGuard,
    BrandController.queryBrands
)

router.get("/categories",
    StoreAuthenticateGuard,
    CategoryController.queryCategories
)

router.get("/sub_categories",
    StoreAuthenticateGuard,
    CategoryController.querySubCategories
)

module.exports = router;