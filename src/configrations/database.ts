import Nano from 'nano';
import PouchDB from 'pouchdb-core';
import PouchDBFind from 'pouchdb-find';
import PouchDBHttp from 'pouchdb-adapter-http';
import PouchDBLevelDB from 'pouchdb-adapter-leveldb';
import PouchDBInMemory from 'pouchdb-adapter-memory';
import PouchDBReplication from 'pouchdb-replication';

import ExpressPouch from 'express-pouchdb';

import { Log } from '../utils/logger';
import { databasePath } from './paths';

import { Account } from '../models/management/account';
import { Session } from '../models/management/session';
import { Database } from '../models/management/database';
import { Owner } from '../models/management/owner';
import { Group, User } from '../models/management/users';
import { Store, StoreSettings } from '../models/management/store';
import { Supplier } from '../models/management/supplier';
import { Producer } from '../models/management/producer';
import { Product } from '../models/management/product';
import { Category, SubCategory } from '../models/management/category';
import { Brand } from '../models/management/brand';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBInMemory);
PouchDB.plugin(PouchDBLevelDB);
PouchDB.plugin(PouchDBHttp);
PouchDB.plugin(PouchDBReplication);

export const DatabaseQueryLimit = 1000;

export const FileSystemConfigration: PouchDB.Configuration.DatabaseConfiguration = { revs_limit: 3, auto_compaction: true, adapter: 'leveldb' };
export const InMemoryConfigration: PouchDB.Configuration.DatabaseConfiguration = { revs_limit: 3, auto_compaction: true, adapter: 'memory' };

export const ManagementDB = {
    Users: new PouchDB<User>(databasePath + 'management/users', FileSystemConfigration),
    Groups: new PouchDB<Group>(databasePath + 'management/groups', FileSystemConfigration),
    Databases: new PouchDB<Database>(databasePath + 'management/databases', FileSystemConfigration),
    Accounts: new PouchDB<Account>(databasePath + 'management/accounts', FileSystemConfigration),
    Owners: new PouchDB<Owner>(databasePath + 'management/owners', FileSystemConfigration),
    Stores: new PouchDB<Store>(databasePath + 'management/stores', FileSystemConfigration),
    Suppliers: new PouchDB<Supplier>(databasePath + 'management/suppliers', FileSystemConfigration),
    Producers: new PouchDB<Producer>(databasePath + 'management/producers', FileSystemConfigration),
    Brands: new PouchDB<Brand>(databasePath + 'management/brands', FileSystemConfigration),
    Products: new PouchDB<Product>(databasePath + 'management/products', FileSystemConfigration),
    Categories: new PouchDB<Category>(databasePath + 'management/categories', FileSystemConfigration),
    SubCategories: new PouchDB<SubCategory>(databasePath + 'management/sub_categories', FileSystemConfigration),
    Logs: new PouchDB<Log>(databasePath + 'management/logs', FileSystemConfigration),
    Sessions: new PouchDB<Session>(databasePath + 'management/sessions', FileSystemConfigration)
}

export const StoresDB = {
    Infos: new PouchDB<Store>(databasePath + 'store/info', FileSystemConfigration),
    Settings: new PouchDB<StoreSettings>(databasePath + 'store/settings', FileSystemConfigration),
    Sessions: new PouchDB<Session>(databasePath + 'store/sessions', FileSystemConfigration),
}

export const AdressDB = {
    Countries: new PouchDB<User>(databasePath + 'address/countries', FileSystemConfigration),
    States: new PouchDB<User>(databasePath + 'address/cities', FileSystemConfigration),
    Provinces: new PouchDB<Group>(databasePath + 'address/provinces', FileSystemConfigration),
    Districts: new PouchDB<Database>(databasePath + 'address/districts', FileSystemConfigration),
    Streets: new PouchDB<Database>(databasePath + 'address/streets', FileSystemConfigration),
}

export const SocialDB = {
    Locations: new PouchDB(databasePath + 'social/locations', FileSystemConfigration),
    Collections: new PouchDB(databasePath + 'social/collections', FileSystemConfigration),
    Categories: new PouchDB(databasePath + 'social/categories', FileSystemConfigration),
    Cuisines: new PouchDB(databasePath + 'social/cuisines', FileSystemConfigration),
    Stores: new PouchDB(databasePath + 'social/stores', FileSystemConfigration),
    Tables: new PouchDB(databasePath + 'social/tables', FileSystemConfigration),
    Products: new PouchDB(databasePath + 'social/products', FileSystemConfigration),
    Floors: new PouchDB(databasePath + 'social/floors', FileSystemConfigration),
    Users: new PouchDB(databasePath + 'social/users', FileSystemConfigration),
    Settings: new PouchDB(databasePath + 'social/settings', FileSystemConfigration),
    Comments: new PouchDB(databasePath + 'social/comments', FileSystemConfigration),
    Sessions: new PouchDB(databasePath + 'social/sessions', FileSystemConfigration),
}


export const CouchDB = (database: Database) => {
    return Nano(`http://${database.username}:${database.password}@${database.host}:${database.port}`);
}

export const RemoteDB = (database: Database, collection: string) => {
    return new PouchDB<any>(`http://${database.username}:${database.password}@${database.host}:${database.port}/${collection}`, { adapter: 'http' });
}

export const StoreDB = async (store_id: any) => {
    try {
        const Store: Store = await ManagementDB.Stores.get(store_id);
        const Database: Database = await ManagementDB.Databases.get(Store.auth.database_id);
        return RemoteDB(Database, Store.auth.database_name);
    } catch (error) {
        throw Error('Store DB Connection Error: ' + error);
    }
}

export const RemoteCollection = (database: Database, collection: string, username: string, password: string) => {
    return new PouchDB<any>(`http://${username}:${password}@${database.host}:${database.port}/${collection}`, { adapter: 'http' });
}

export const OrderDatabase = PouchDB.defaults({ size: 10, ...InMemoryConfigration });
export const OrderMiddleware = ExpressPouch(OrderDatabase, { inMemoryConfig: true, overrideMode: { exclude: ['routes/authentication', 'routes/authorization', 'routes/session', 'routes/all-dbs',] } }); // mode: 'minimumForPouchDB', overrideMode: { exclude: ['routes/authentication', 'routes/authorization', 'routes/session'] } 

export const OrderDB = async (store_id: string | string[], name: string, sync: boolean) => {
    try {
        const Database = new OrderDatabase(name);
        const StoreDatabase = await StoreDB(store_id);
        // Database.changes({ since: 'now', live: true, include_docs: true, selector: { db_name: 'orders' } })
        //     .on('change', (changes) => {
        //         if (!changes.deleted) {
        //             delete changes.doc._rev;
        //             StoreDatabase.put({ check: name, ...changes.doc }).then(sendedOrders => {
        //                 console.log(sendedOrders.ok);
        //             }).catch(err => {
        //                 console.log(err);
        //             });
        //         }
        //     })
        //     .on('error', (err) => {
        //         console.log(err);
        //     })
        if (sync) {
            Database.sync(StoreDatabase, { since: 'now', live: true, selector: { $or: [{ db_name: 'orders', check: name }, { db_name: 'receipts', check: name }] } })
                .on('change', (changes) => {
                    // console.log(changes)
                }).on('error', (err) => {
                    console.log(err);
                })
        }
        return Database;

    } catch (error) {
        console.log(error);
    }
}