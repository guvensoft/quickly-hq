import { Router } from 'express';

import * as AccountController from '../controllers/management/account';
import * as AuthController from '../controllers/management/authentication';
import * as DatabaseController from '../controllers/management/database';
import * as GroupController from '../controllers/management/group';
import * as OwnerController from '../controllers/management/owner';
import * as StoreController from '../controllers/management/store';
import * as UserController from '../controllers/management/user';
import * as ProducerController from '../controllers/management/producer';
import * as BrandController from '../controllers/management/brand';
import * as ProductController from '../controllers/management/product';
import * as SupplierController from '../controllers/management/supplier';
import * as UtilsController from '../controllers/management/utils';
import * as AddressController from '../controllers/management/address';
import * as CategoryController from '../controllers/management/category';

import { AuthenticateGuard, SchemaGuard } from '../middlewares/management';
import * as ManagementSchema from '../schemas/management';

const router = Router();

// Auths
router.post("/auth/login",
    SchemaGuard(ManagementSchema.AuthSchemaSafe),
    AuthController.Login);

router.post("/auth/logout",
    AuthenticateGuard,
    AuthController.Logout);

router.post("/auth/verify",
    AuthenticateGuard,
    AuthController.Verify);

// Accounts
router.get("/account/:id",
    AuthenticateGuard,
    AccountController.getAccount);

router.post("/account",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.AccountSchemaSafe),
    AccountController.createAccount);

router.put("/account/:id",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.AccountSchema),
    AccountController.updateAccount);

router.delete("/account/:id",
    AuthenticateGuard,
    AccountController.deleteAccount);

router.get("/accounts",
    AuthenticateGuard,
    AccountController.queryAccounts);


// Owners
router.get("/owner/:id",
    AuthenticateGuard,
    OwnerController.getOwner);

router.post("/owner",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.OwnerSchemaSafe),
    OwnerController.createOwner);

router.put("/owner/:id",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.OwnerSchema),
    OwnerController.updateOwner);

router.delete("/owner/:id",
    AuthenticateGuard,
    OwnerController.deleteOwner);

router.get("/owners",
    AuthenticateGuard,
    OwnerController.queryOwners);

// Databases 
router.get("/database/:id",
    AuthenticateGuard,
    DatabaseController.getDatabase);

router.post("/database",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.DatabaseSchemaSafe),
    DatabaseController.createDatabase);

router.put("/database/:id",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.DatabaseSchema),
    DatabaseController.updateDatabase);

router.delete("/database/:id",
    AuthenticateGuard,
    DatabaseController.deleteDatabase);

router.get("/databases",
    AuthenticateGuard,
    DatabaseController.queryDatabases);

// RemoteDB
router.get("/database/remote/:id",
    AuthenticateGuard,
    DatabaseController.listRemoteDB);

router.get("/database/remote/:id/:db",
    AuthenticateGuard,
    DatabaseController.openRemoteDB)

router.put("/database/remote/:id/:db",
    AuthenticateGuard,
    DatabaseController.createCollectionDB);

router.get("/database/social/:db",
    AuthenticateGuard,
    DatabaseController.getSocialDB);

// Users
router.get("/user/:id",
    AuthenticateGuard,
    UserController.getUser);

router.post("/user",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.UserSchemaSafe),
    UserController.createUser);

router.put("/user/:id",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.UserSchema),
    UserController.updateUser);

router.delete("/user/:id",
    AuthenticateGuard,
    UserController.deleteUser);

router.get("/users",
    AuthenticateGuard,
    UserController.queryUsers);

// Groups
router.get("/group/:id",
    AuthenticateGuard,
    GroupController.getGroup);

router.post("/group",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.GroupSchemaSafe),
    GroupController.createGroup);

router.put("/group/:id",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.GroupSchema),
    GroupController.updateGroup);

router.delete("/group/:id",
    AuthenticateGuard,
    GroupController.deleteGroup);

router.get("/groups",
    AuthenticateGuard,
    GroupController.queryGroups);

// Stores
router.get("/store/:id",
    AuthenticateGuard,
    StoreController.getStore);

router.post("/store",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.StoreSchemaSafe),
    StoreController.createStore);

router.put("/store/:id",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.StoreSchema),
    StoreController.updateStore);

router.delete("/store/:id",
    AuthenticateGuard,
    StoreController.deleteStore);

router.get("/stores",
    AuthenticateGuard,
    StoreController.queryStores);

// Products
router.get("/product/:id",
    AuthenticateGuard,
    ProductController.getProduct);

router.post("/product",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.ProductSchemaSafe),
    ProductController.createProduct);

router.put("/product/:id",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.ProductSchema),
    ProductController.updateProduct);

router.delete("/product/:id",
    AuthenticateGuard,
    ProductController.deleteProduct);

router.get("/products",
    AuthenticateGuard,
    ProductController.queryProducts);

// Suppliers
router.get("/supplier/:id",
    AuthenticateGuard,
    SupplierController.getSupplier);

router.post("/supplier",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.SupplierSchemaSafe),
    SupplierController.createSupplier);

router.put("/supplier/:id",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.SupplierSchema),
    SupplierController.updateSupplier);

router.delete("/supplier/:id",
    AuthenticateGuard,
    SupplierController.deleteSupplier);

router.get("/suppliers",
    AuthenticateGuard,
    SupplierController.querySuppliers);

// Producers
router.get("/producer/:id",
    AuthenticateGuard,
    ProducerController.getProducer);

router.post("/producer",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.ProducerSchemaSafe),
    ProducerController.createProducer);

router.put("/producer/:id",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.ProducerSchema),
    ProducerController.updateProducer);

router.delete("/producer/:id",
    AuthenticateGuard,
    ProducerController.deleteProducer);

router.get("/producers",
    AuthenticateGuard,
    ProducerController.queryProducers);


// Brands
router.get("/brand/:id",
    AuthenticateGuard,
    BrandController.getBrand);

router.post("/brand",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.BrandSchemaSafe),
    BrandController.createBrand);

router.put("/brand/:id",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.BrandSchema),
    BrandController.updateBrand);

router.delete("/brand/:id",
    AuthenticateGuard,
    BrandController.deleteBrand);

router.get("/brands",
    AuthenticateGuard,
    BrandController.queryBrands);


// Categories
router.get("/category/:id",
    AuthenticateGuard,
    CategoryController.getCategory);

router.post("/category",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.CategorySchemaSafe),
    CategoryController.createCategory);

router.put("/category/:id",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.CategorySchema),
    CategoryController.updateCategory);

router.delete("/category/:id",
    AuthenticateGuard,
    CategoryController.deleteCategory);

router.get("/categories",
    AuthenticateGuard,
    CategoryController.queryCategories);


// SubCategories
router.get("/sub_category/:id",
    AuthenticateGuard,
    CategoryController.getSubCategory);

router.post("/sub_category",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.SubCategorySchemaSafe),
    CategoryController.createSubCategory);

router.put("/sub_category/:id",
    AuthenticateGuard,
    SchemaGuard(ManagementSchema.SubCategorySchema),
    CategoryController.updateSubCategory);

router.delete("/sub_category/:id",
    AuthenticateGuard,
    CategoryController.deleteSubCategory);

router.get("/sub_categories",
    AuthenticateGuard,
    CategoryController.querySubCategories);


// Address
router.get("/address/:country?/:city?/:province?/:district?",
    AddressController.getAddress);

// Utils
router.get("/utils/images/:text",
    AuthenticateGuard,
    UtilsController.getImage);

router.get("/utils/logs/errors",
    AuthenticateGuard,
    UtilsController.getErrorLogs);

router.get("/utils/logs/access",
    AuthenticateGuard,
    UtilsController.getAccessLogs);

router.get("/utils/venues/:text",
    AuthenticateGuard,
    UtilsController.getVenues);

module.exports = router;