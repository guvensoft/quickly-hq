![](https://kurumsal.quickly.com.tr/assets/client-dark.png)
***
# Quickly Headquarters API (v1.2.6)

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
**/auth/login** | PUT  | None  | SchemaGuard |`AuthController.Login()`
**/auth/logout** | PUT  | AuthenticateGuard |`AuthController.Logout()`
**/auth/verify** | PUT  | AuthenticateGuard |`AuthController.Verify()`

##### Accounts

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**/account** | POST  | AuthenticateGuard, SchemaGuard |`AccountController.createAccount()`
**/account/:id** | GET  | AuthenticateGuard |`AccountController.getAccount()`
**/account/:id** | PUT  | AuthenticateGuard, SchemaGuard |`AccountController.updateAccount()`
**/account/:id** | DELETE  | AuthenticateGuard |`AccountController.deleteAccount()`
**/accounts** | GET  | AuthenticateGuard |`AccountController.queryAccounts()`

##### Owners

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**/account** | POST  | AuthenticateGuard, SchemaGuard |`OwnerController.createOwner()`
**/account/:id** | GET  | AuthenticateGuard  |`OwnerController.getOwner()`
**/account/:id** | PUT  | AuthenticateGuard, SchemaGuard |`OwnerController.updateOwner()`
**/account/:id** | DELETE  | AuthenticateGuard, |`OwnerController.deleteOwner()`
**/accounts** | GET  | AuthenticateGuard, |`OwnerController.queryOwners()`

##### Databases

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**/database** | POST  | AuthenticateGuard, SchemaGuard |`DatabaseController.createDatabase()`
**/database/:id** | GET  | AuthenticateGuard  |`DatabaseController.getDatabase()`
**/database/:id** | PUT  | AuthenticateGuard, SchemaGuard |`DatabaseController.updateDatabase()`
**/database/:id** | DELETE  | AuthenticateGuard, |`DatabaseController.deleteDatabase()`
**/databases** | GET  | AuthenticateGuard, |`DatabaseController.queryDatabases()`

##### Users

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**/user** | POST  | AuthenticateGuard, SchemaGuard |`UserController.createUser()`
**/user/:id** | GET  | AuthenticateGuard  |`UserController.getUser()`
**/user/:id** | PUT  | AuthenticateGuard, SchemaGuard |`UserController.updateUser()`
**/user/:id** | DELETE  | AuthenticateGuard, |`UserController.deleteUser()`
**/users** | GET  | AuthenticateGuard, |`UserController.queryUsers()`


##### Groups

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**/group** | POST  | AuthenticateGuard, SchemaGuard |`GroupController.createGroup()`
**/group/:id** | GET  | AuthenticateGuard  |`GroupController.getGroup()`
**/group/:id** | PUT  | AuthenticateGuard, SchemaGuard |`GroupController.updateGroup()`
**/group/:id** | DELETE  | AuthenticateGuard, |`GroupController.deleteGroup()`
**/groups** | GET  | AuthenticateGuard, |`GroupController.queryGroups()`

##### Stores

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**/store** | POST  | AuthenticateGuard, SchemaGuard |`StoreController.createStore()`
**/store/:id** | GET  | AuthenticateGuard  |`StoreController.getStore()`
**/store/:id** | PUT  | AuthenticateGuard, SchemaGuard |`StoreController.updateStore()`
**/store/:id** | DELETE  | AuthenticateGuard, |`StoreController.deleteStore()`
**/stores** | GET  | AuthenticateGuard, |`StoreController.queryStores()`

##### Producers

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**/producer** | POST  | AuthenticateGuard, SchemaGuard |`ProducerController.createProducer()`
**/producer/:id** | GET  | AuthenticateGuard  |`ProducerController.getProducer()`
**/producer/:id** | PUT  | AuthenticateGuard, SchemaGuard |`ProducerController.updateProducer()`
**/producer/:id** | DELETE  | AuthenticateGuard, |`ProducerController.deleteProducer()`
**/producers** | GET  | AuthenticateGuard, |`ProducerController.queryProducers()`

##### Products

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**/product** | POST  | AuthenticateGuard, SchemaGuard |`ProductController.createProduct()` 
**/product/:id** | GET  | AuthenticateGuard  |`ProductController.getProduct()`
**/product/:id** | PUT  | AuthenticateGuard, SchemaGuard |`ProductController.updateProduct()`
**/product/:id** | DELETE  | AuthenticateGuard, |`ProductController.deleteProduct()`
**/products** | GET  | AuthenticateGuard, |`ProductController.queryProducts()`

##### Categories (TODO)

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**/category** | POST | AuthenticateGuard, SchemaGuard |`CategoryController.createCategory()`
**/category/:id** | GET  | AuthenticateGuard  |`CategoryController.getCategory()`
**/category/:id** | PUT  | AuthenticateGuard, SchemaGuard |`CategoryController.updateCategory()`
**/category/:id** | DELETE  | AuthenticateGuard, |`CategoryController.deleteCategory()`
**/categories** | GET | AuthenticateGuard, |`CategoryController.queryCategories()`
**/sub_category** | POST  | AuthenticateGuard, SchemaGuard |`CategoryController.createSubCategory()`
**/sub_category/:id** | GET | AuthenticateGuard  |`CategoryController.getSubCategory()`
**/sub_category/:id** | PUT | AuthenticateGuard, SchemaGuard |`CategoryController.updateSubCategory()`
**/sub_category/:id** | DELETE  | AuthenticateGuard, |`CategoryController.deleteSubCategory()`
**/sub_categories** | GET | AuthenticateGuard, |`CategoryController.querySubCategories()`

##### Suppliers

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**/supplier** | POST  | AuthenticateGuard, SchemaGuard |`SupplierController.createSupplier()`
**/supplier/:id** | GET  | AuthenticateGuard  |`SupplierController.getSupplier()`
**/supplier/:id** | PUT  | AuthenticateGuard, SchemaGuard |`SupplierController.updateSupplier()`
**/supplier/:id** | DELETE  | AuthenticateGuard, |`SupplierController.deleteSupplier()`
**/suppliers** | GET  | AuthenticateGuard, |`SupplierController.querySuppliers()`


##### Address

Route | Method | Middlewares | Controller
------------ | ------------- | ------------ | ------------- 
**/address/:country?/:city?/:province?/:district?** | GET   |Authorization| AuthenticateGuard |`AddressController.getAddress()`


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