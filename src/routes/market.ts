import { Router } from 'express';

import * as ProducerController from '../controllers/management/producer';
import * as ProductController from '../controllers/management/product';
import * as SupplierController from '../controllers/management/supplier';
import * as CategoryController from '../controllers/management/category';
import * as BrandController from '../controllers/management/brand';

import * as StockController from '../controllers/market/stock';

import { StoreAuthenticateGuard } from '../middlewares/store';

const router = Router();

// Products
router.get("/product/:id",
    StoreAuthenticateGuard,
    ProductController.getProduct);

router.get("/products",
    StoreAuthenticateGuard,
    ProductController.queryProducts);

// Suppliers
router.get("/supplier/:id",
    StoreAuthenticateGuard,
    SupplierController.getSupplier);

router.get("/suppliers",
    StoreAuthenticateGuard,
    SupplierController.querySuppliers);

// Producers
router.get("/producer/:id",
    StoreAuthenticateGuard,
    ProducerController.getProducer);

router.get("/producers",
    StoreAuthenticateGuard,
    ProducerController.queryProducers);


// Brands
router.get("/brand/:id",
    StoreAuthenticateGuard,
    BrandController.getBrand);

router.get("/brands",
    StoreAuthenticateGuard,
    BrandController.queryBrands);


// Categories
router.get("/category/:id",
    StoreAuthenticateGuard,
    CategoryController.getCategory);

router.get("/categories",
    StoreAuthenticateGuard,
    CategoryController.queryCategories);


// SubCategories
router.get("/sub_category/:id",
    StoreAuthenticateGuard,
    CategoryController.getSubCategory);

router.get("/sub_categories",
    StoreAuthenticateGuard,
    CategoryController.querySubCategories);


router.post("/add_stock/:product_id/:quantity",
    StoreAuthenticateGuard,
    StockController.addStock
)

module.exports = router;