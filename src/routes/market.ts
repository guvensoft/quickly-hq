import { Router } from 'express';

import * as ProducerController from '../controllers/management/producer';
import * as ProductController from '../controllers/management/product';
import * as SupplierController from '../controllers/management/supplier';
import * as CategoryController from '../controllers/management/category';
import * as BrandController from '../controllers/management/brand';

import * as StockController from '../controllers/market/stock';

import { MarketAccountGuard, MarketStoreGuard } from '../middlewares/market';

const router = Router();

// Products
router.get("/product/:id",
    MarketAccountGuard,
    MarketStoreGuard,
    ProductController.getProduct);

router.get("/products",
    MarketAccountGuard,
    MarketStoreGuard,
    ProductController.queryProducts);

// Suppliers
router.get("/supplier/:id",
    MarketAccountGuard,
    MarketStoreGuard,
    SupplierController.getSupplier);

router.get("/suppliers",
    MarketAccountGuard,
    MarketStoreGuard,
    SupplierController.querySuppliers);

// Producers
router.get("/producer/:id",
    MarketAccountGuard,
    MarketStoreGuard,
    ProducerController.getProducer);

router.get("/producers",
    MarketAccountGuard,
    MarketStoreGuard,
    ProducerController.queryProducers);


// Brands
router.get("/brand/:id",
    MarketAccountGuard,
    MarketStoreGuard,
    BrandController.getBrand);

router.get("/brands",
    MarketAccountGuard,
    MarketStoreGuard,
    BrandController.queryBrands);


// Categories
router.get("/category/:id",
    MarketAccountGuard,
    MarketStoreGuard,
    CategoryController.getCategory);

router.get("/categories",
    MarketAccountGuard,
    MarketStoreGuard,
    CategoryController.queryCategories);


// SubCategories
router.get("/sub_category/:id",
    MarketAccountGuard,
    MarketStoreGuard,
    CategoryController.getSubCategory);

router.get("/sub_categories",
    MarketAccountGuard,
    MarketStoreGuard,
    CategoryController.querySubCategories);


router.post("/add_stock/:product_id/:quantity",
    MarketAccountGuard,
    MarketStoreGuard,
    StockController.addStock
)

module.exports = router;