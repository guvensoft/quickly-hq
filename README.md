![](https://kurumsal.quickly.com.tr/assets/client-dark.png)
***
# Quickly Headquarters API (v1.0.0)

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

| Route| Method |Header|Middlewares|Controller|
| -------------| ---------|------------------|---------------------|------------------|------------|
|  **management/auth/login** | PUT  | None  | SchemaGuard |`AuthController.Login()` |
| ** management/auth/logout** | PUT  | Authorization  | AuthenticateGuard |`AuthController.Logout()` |
| ** management/auth/verify** | PUT  | Authorization  | AuthenticateGuard |`AuthController.Verify()` |

##### Accounts

| Route| Method |Header|Middlewares|Controller|
| ----------------------| ---------|------------------|---------------------|---------------|----------|
|  **management/account** | POST  | Authorization  | AuthenticateGuard, SchemaGuard |`AccountController.createAccount()` |
| ** management/account/:id** | GET  | Authorization  | AuthenticateGuard |`AccountController.getAccount()` |
| ** management/account/:id** | PUT  | Authorization  | AuthenticateGuard, SchemaGuard |`AccountController.updateAccount()` |
|  **management/account/:id** | DELETE  | Authorization  | AuthenticateGuard |`AccountController.deleteAccount()` |
| ** management/accounts** | GET  | Authorization  | AuthenticateGuard |`AccountController.queryAccounts()` |

##### Owners

| Route| Method |Header|Middlewares|Controller|
| ----------------------| ---------|------------------|---------------------|---------------|----------|
|  **management/account** | POST  | Authorization  | AuthenticateGuard, SchemaGuard |`OwnerController.createOwner()` |
| ** management/account/:id** | GET  | Authorization  | AuthenticateGuard  |`OwnerController.getOwner()` |
| ** management/account/:id** | PUT  | Authorization  | AuthenticateGuard, SchemaGuard |`OwnerController.updateOwner()` |
|  **management/account/:id** | DELETE  | Authorization  | AuthenticateGuard, |`OwnerController.deleteOwner()` |
| ** management/accounts** | GET  | Authorization  | AuthenticateGuard, |`OwnerController.queryOwners()` |

##### Databases

| Route| Method |Header|Middlewares|Controller|
| ----------------------| ---------|------------------|---------------------|---------------|----------|
|  **management/database** | POST  | Authorization  | AuthenticateGuard, SchemaGuard |`DatabaseController.createDatabase()` |
| ** management/database/:id** | GET  |  Authorization  | AuthenticateGuard  |`DatabaseController.getDatabase()` |
| ** management/database/:id** | PUT  |  Authorization  | AuthenticateGuard, SchemaGuard |`DatabaseController.updateDatabase()` |
|  **management/database/:id** | DELETE  | Authorization  | AuthenticateGuard, |`DatabaseController.deleteDatabase()` |
| ** management/databases** | GET  | Authorization  | AuthenticateGuard, |`DatabaseController.queryDatabases()` |

##### Users

| Route| Method |Header|Middlewares|Controller|
| ----------------------| ---------|------------------|---------------------|---------------|----------|
|  **management/user** | POST  |  Authorization  | AuthenticateGuard, SchemaGuard |`UserController.createUser()` |
| ** management/user/:id** | GET  |  Authorization  | AuthenticateGuard  |`UserController.getUser()` |
| ** management/user/:id** | PUT  |  Authorization  | AuthenticateGuard, SchemaGuard |`UserController.updateUser()` |
|  **management/user/:id** | DELETE  |  Authorization  | AuthenticateGuard, |`UserController.deleteUser()` |
| ** management/users** | GET  |  Authorization  | AuthenticateGuard, |`UserController.queryUsers()` |


##### Groups

| Route| Method |Header|Middlewares|Controller|
| ----------------------| ---------|------------------|---------------------|---------------|----------|
|  **management/group** | POST  | Authorization  | AuthenticateGuard, SchemaGuard |`GroupController.createGroup()` |
| ** management/group/:id** | GET  | Authorization  | AuthenticateGuard  |`GroupController.getGroup()` |
| ** management/group/:id** | PUT  | Authorization  | AuthenticateGuard, SchemaGuard |`GroupController.updateGroup()` |
|  **management/group/:id** | DELETE  | Authorization  | AuthenticateGuard, |`GroupController.deleteGroup()` |
| ** management/groups** | GET  | Authorization  | AuthenticateGuard, |`GroupController.queryGroups()` |

##### Stores

| Route| Method |Header|Middlewares|Controller|
| -------------| ---------|------------------|---------------------|---------------|----------|
|  **management/store** | POST  | Authorization  | AuthenticateGuard, SchemaGuard |`StoreController.createStore()` |
| ** management/store/:id** | GET  | Authorization  | AuthenticateGuard  |`StoreController.getStore()` |
| ** management/store/:id** | PUT  | Authorization  | AuthenticateGuard, SchemaGuard |`StoreController.updateStore()` |
|  **management/store/:id** | DELETE  | Authorization  | AuthenticateGuard, |`StoreController.deleteStore()` |
| ** management/stores** | GET  | Authorization  | AuthenticateGuard, |`StoreController.queryStores()` |

##### Producers

| Route| Method |Header|Middlewares|Controller|
| -------------| ---------|------------------|---------------------|---------------|----------|
|  **management/producer** | POST  | Authorization  | AuthenticateGuard, SchemaGuard |`ProducerController.createProducer()` |
| ** management/producer/:id** | GET  | Authorization  | AuthenticateGuard  |`ProducerController.getProducer()` |
| ** management/producer/:id** | PUT  | Authorization  | AuthenticateGuard, SchemaGuard |`ProducerController.updateProducer()` |
|  **management/producer/:id** | DELETE  | Authorization  | AuthenticateGuard, |`ProducerController.deleteProducer()` |
| ** management/producers** | GET  | Authorization  | AuthenticateGuard, |`ProducerController.queryProducers()` |

##### Products

| Route| Method |Header|Middlewares|Controller|
| -------------| ---------|------------------|---------------------|---------------|----------|
|  **management/product** | POST  | Authorization  | AuthenticateGuard, SchemaGuard |`ProductController.createProduct()` |
| ** management/product/:id** | GET  | Authorization  | AuthenticateGuard  |`ProductController.getProduct()` |
| ** management/product/:id** | PUT  | Authorization  | AuthenticateGuard, SchemaGuard |`ProductController.updateProduct()` |
|  **management/product/:id** | DELETE  | Authorization  | AuthenticateGuard, |`ProductController.deleteProduct()` |
| ** management/products** | GET  | Authorization  | AuthenticateGuard, |`ProductController.queryProducts()` |

##### Categories (TODO)

First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column

Route| Method |Header|Middlewares|Controller|
-------------| ---------|------------------|---------------------|---------------|----------|
 **management/category** | POST  | Authorization  | AuthenticateGuard, SchemaGuard |`CategoryController.createCategory()` |
** management/category/:id** | GET  | Authorization  | AuthenticateGuard  |`CategoryController.getCategory()` |
** management/category/:id** | PUT  | Authorization  | AuthenticateGuard, SchemaGuard |`CategoryController.updateCategory()` |
 **management/category/:id** | DELETE  | Authorization  | AuthenticateGuard, |`CategoryController.deleteCategory()` |
** management/categories** | GET  | Authorization  | AuthenticateGuard, |`CategoryController.queryCategories()` |
 **management/sub_category** | POST  | Authorization  | AuthenticateGuard, SchemaGuard |`CategoryController.createSubCategory()` |
** management/sub_category/:id** | GET  | Authorization  | AuthenticateGuard  |`CategoryController.getSubCategory()` |
** management/sub_category/:id** | PUT  | Authorization  | AuthenticateGuard, SchemaGuard |`CategoryController.updateSubCategory()` |
 **management/sub_category/:id** | DELETE  | Authorization  | AuthenticateGuard, |`CategoryController.deleteSubCategory()` |
** management/sub_categories** | GET  | Authorization  | AuthenticateGuard, |`CategoryController.querySubCategories()` |

##### Suppliers

| Route| Method |Header|Middlewares|Controller|
| -------------| ---------|------------------|---------------------|---------------|----------|
|  **management/supplier** | POST  | Authorization  | AuthenticateGuard, SchemaGuard |`SupplierController.createSupplier()` |
| ** management/supplier/:id** | GET  | Authorization  | AuthenticateGuard  |`SupplierController.getSupplier()` |
| ** management/supplier/:id** | PUT  | Authorization  | AuthenticateGuard, SchemaGuard |`SupplierController.updateSupplier()` |
|  **management/supplier/:id** | DELETE  | Authorization  | AuthenticateGuard, |`SupplierController.deleteSupplier()` |
| ** management/suppliers** | GET  | Authorization  | AuthenticateGuard, |`SupplierController.querySuppliers()` |


##### Address

| Route| Method |Header|Middlewares|Controller|
| -------------| ---------|------------------|---------------------|---------------|----------|
|  **management/address/:country?/:city?/:province?/:district?** | GET   |Authorization| AuthenticateGuard |`AddressController.getAddress()` |


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