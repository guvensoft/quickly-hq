![](https://kurumsal.quickly.com.tr/assets/client-dark.png)
***
# Quickly Headquarters API (v1.1.2)

https://hq.quickly.com.tr - https://www.quickly.com.tr

[TOCM]

[TOC]

### Libraries

- Node.js (v10.12.10) - Express.js (4.16.4)
- PouchDB (7.0.0)  - Nano (v7.1.1)
- TypeScript (3.1.6)
- Bcrypt (v3.0.0) - Joi (14.4.0) - Morgan (v1.9.1)
- Nodemon (v1.18.17)

### Databases
- LevelDB
- RocksDB ('Not Ready Yet')
- CouchDB (v2.1.1)
- InMemory Database (PouchDB-Memory)

### Folder/File Structure

TODO

### Controllers

#### Management Controllers
TODO
#### Store Controllers
TODO
#### Market Controllers
TODO

### Routes

#### Management Routes

- Just need a '**Authorization**' Header for every request. Except two  'Authentication' routes

##### Authentication

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**management/auth/login** | PUT  | None  | SchemaGuard |`AuthController.Login()`
**management/auth/logout** | PUT  | AuthenticateGuard |`AuthController.Logout()`
**management/auth/verify** | PUT  | AuthenticateGuard |`AuthController.Verify()`

##### Accounts

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**management/account** | POST  | AuthenticateGuard, SchemaGuard |`AccountController.createAccount()`
**management/account/:id** | GET  | AuthenticateGuard |`AccountController.getAccount()`
**management/account/:id** | PUT  | AuthenticateGuard, SchemaGuard |`AccountController.updateAccount()`
**management/account/:id** | DELETE  | AuthenticateGuard |`AccountController.deleteAccount()`
**management/accounts** | GET  | AuthenticateGuard |`AccountController.queryAccounts()`

##### Owners

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**management/account** | POST  | AuthenticateGuard, SchemaGuard |`OwnerController.createOwner()`
**management/account/:id** | GET  | AuthenticateGuard  |`OwnerController.getOwner()`
**management/account/:id** | PUT  | AuthenticateGuard, SchemaGuard |`OwnerController.updateOwner()`
**management/account/:id** | DELETE  | AuthenticateGuard, |`OwnerController.deleteOwner()`
**management/accounts** | GET  | AuthenticateGuard, |`OwnerController.queryOwners()`

##### Databases

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**management/database** | POST  | AuthenticateGuard, SchemaGuard |`DatabaseController.createDatabase()`
**management/database/:id** | GET  | AuthenticateGuard  |`DatabaseController.getDatabase()`
**management/database/:id** | PUT  | AuthenticateGuard, SchemaGuard |`DatabaseController.updateDatabase()`
**management/database/:id** | DELETE  | AuthenticateGuard, |`DatabaseController.deleteDatabase()`
**management/databases** | GET  | AuthenticateGuard, |`DatabaseController.queryDatabases()`

##### Users

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**management/user** | POST  | AuthenticateGuard, SchemaGuard |`UserController.createUser()`
**management/user/:id** | GET  | AuthenticateGuard  |`UserController.getUser()`
**management/user/:id** | PUT  | AuthenticateGuard, SchemaGuard |`UserController.updateUser()`
**management/user/:id** | DELETE  | AuthenticateGuard, |`UserController.deleteUser()`
**management/users** | GET  | AuthenticateGuard, |`UserController.queryUsers()`


##### Groups

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**management/group** | POST  | AuthenticateGuard, SchemaGuard |`GroupController.createGroup()`
**management/group/:id** | GET  | AuthenticateGuard  |`GroupController.getGroup()`
**management/group/:id** | PUT  | AuthenticateGuard, SchemaGuard |`GroupController.updateGroup()`
**management/group/:id** | DELETE  | AuthenticateGuard, |`GroupController.deleteGroup()`
**management/groups** | GET  | AuthenticateGuard, |`GroupController.queryGroups()`

##### Stores

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**management/store** | POST  | AuthenticateGuard, SchemaGuard |`StoreController.createStore()`
**management/store/:id** | GET  | AuthenticateGuard  |`StoreController.getStore()`
**management/store/:id** | PUT  | AuthenticateGuard, SchemaGuard |`StoreController.updateStore()`
**management/store/:id** | DELETE  | AuthenticateGuard, |`StoreController.deleteStore()`
**management/stores** | GET  | AuthenticateGuard, |`StoreController.queryStores()`

##### Producers

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**management/producer** | POST  | AuthenticateGuard, SchemaGuard |`ProducerController.createProducer()`
**management/producer/:id** | GET  | AuthenticateGuard  |`ProducerController.getProducer()`
**management/producer/:id** | PUT  | AuthenticateGuard, SchemaGuard |`ProducerController.updateProducer()`
**management/producer/:id** | DELETE  | AuthenticateGuard, |`ProducerController.deleteProducer()`
**management/producers** | GET  | AuthenticateGuard, |`ProducerController.queryProducers()`

##### Products

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**management/product** | POST  | AuthenticateGuard, SchemaGuard |`ProductController.createProduct()` 
**management/product/:id** | GET  | AuthenticateGuard  |`ProductController.getProduct()`
**management/product/:id** | PUT  | AuthenticateGuard, SchemaGuard |`ProductController.updateProduct()`
**management/product/:id** | DELETE  | AuthenticateGuard, |`ProductController.deleteProduct()`
**management/products** | GET  | AuthenticateGuard, |`ProductController.queryProducts()`

##### Categories (TODO)

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**management/category** | POST | AuthenticateGuard, SchemaGuard |`CategoryController.createCategory()`
**management/category/:id** | GET  | AuthenticateGuard  |`CategoryController.getCategory()`
**management/category/:id** | PUT  | AuthenticateGuard, SchemaGuard |`CategoryController.updateCategory()`
**management/category/:id** | DELETE  | AuthenticateGuard, |`CategoryController.deleteCategory()`
**management/categories** | GET | AuthenticateGuard, |`CategoryController.queryCategories()`
**management/sub_category** | POST  | AuthenticateGuard, SchemaGuard |`CategoryController.createSubCategory()`
**management/sub_category/:id** | GET | AuthenticateGuard  |`CategoryController.getSubCategory()`
**management/sub_category/:id** | PUT | AuthenticateGuard, SchemaGuard |`CategoryController.updateSubCategory()`
**management/sub_category/:id** | DELETE  | AuthenticateGuard, |`CategoryController.deleteSubCategory()`
**management/sub_categories** | GET | AuthenticateGuard, |`CategoryController.querySubCategories()`

##### Suppliers

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**management/supplier** | POST  | AuthenticateGuard, SchemaGuard |`SupplierController.createSupplier()`
**management/supplier/:id** | GET  | AuthenticateGuard  |`SupplierController.getSupplier()`
**management/supplier/:id** | PUT  | AuthenticateGuard, SchemaGuard |`SupplierController.updateSupplier()`
**management/supplier/:id** | DELETE  | AuthenticateGuard, |`SupplierController.deleteSupplier()`
**management/suppliers** | GET  | AuthenticateGuard, |`SupplierController.querySuppliers()`


##### Address

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**management/address/:country?/:city?/:province?/:district?** | GET   |Authorization| AuthenticateGuard |`AddressController.getAddress()`


***

#### Store Routes
todo


#### Market Routes
todo


### Middlewares

#### Management Middlewares
todo
#### Store Middlewares
todo
#### Market Middlewares