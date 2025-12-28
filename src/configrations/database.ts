import Nano from 'nano';
import PouchDB from 'pouchdb-core';
import PouchDBFind from 'pouchdb-find';
import PouchDBHttp from 'pouchdb-adapter-http';
import PouchDBLevelDB from 'pouchdb-adapter-leveldb';
import PouchDBInMemory from 'pouchdb-adapter-memory';
import PouchDBReplication from 'pouchdb-replication';
import PouchDBUpsert from 'pouchdb-upsert';

import ExpressPouch from 'express-pouchdb';

import { Log } from '../utils/logger';
import { DATABASE_PATH } from './paths';

import { Account } from '../models/management/account';
import { Session } from '../models/management/session';
import { Database } from '../models/management/database';
import { Owner, OwnerSubscriptions, SafeCard } from '../models/management/owner';
import { Group, User } from '../models/management/users';
import { Store, StoreSettings } from '../models/management/store';
import { Supplier } from '../models/management/supplier';
import { Producer } from '../models/management/producer';
import { Product } from '../models/management/product';
import { Category, SubCategory } from '../models/management/category';
import { Campaign } from '../models/management/campaing';
import { Brand } from '../models/management/brand';
import { Invoice } from '../models/management/invoice';
import { Company } from '../models/management/company';
import { Menu } from '../models/store/menu';

import { createIndexesForDatabase } from '../functions/management/database';
import { OtpCheck } from '../models/utils/otp';
import { AgreementData } from '../models/management/agreement';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBInMemory);
PouchDB.plugin(PouchDBLevelDB);
PouchDB.plugin(PouchDBHttp);
PouchDB.plugin(PouchDBReplication);
PouchDB.plugin(PouchDBUpsert)

export const DatabaseQueryLimit = 2500;

export const FileSystemConfigration: PouchDB.Configuration.DatabaseConfiguration = { revs_limit: 3, auto_compaction: true, adapter: 'leveldb' };
export const InMemoryConfigration: PouchDB.Configuration.DatabaseConfiguration = { revs_limit: 3, auto_compaction: true, adapter: 'memory' };
export const InMemoryMenuConfigration: PouchDB.Configuration.DatabaseConfiguration = { revs_limit: 100, auto_compaction: true, adapter: 'memory' };

export const ManagementDB = {
    Users: new PouchDB<User>(DATABASE_PATH + 'management/users', FileSystemConfigration),
    Groups: new PouchDB<Group>(DATABASE_PATH + 'management/groups', FileSystemConfigration),
    Databases: new PouchDB<Database>(DATABASE_PATH + 'management/databases', FileSystemConfigration),
    Accounts: new PouchDB<Account>(DATABASE_PATH + 'management/accounts', FileSystemConfigration),
    Owners: new PouchDB<Owner>(DATABASE_PATH + 'management/owners', FileSystemConfigration),
    Stores: new PouchDB<Store>(DATABASE_PATH + 'management/stores', FileSystemConfigration),
    Invoices: new PouchDB<Invoice>(DATABASE_PATH + 'management/invoices', FileSystemConfigration),
    Companies: new PouchDB<Company>(DATABASE_PATH + 'management/companies', FileSystemConfigration),
    Suppliers: new PouchDB<Supplier>(DATABASE_PATH + 'management/suppliers', FileSystemConfigration),
    Producers: new PouchDB<Producer>(DATABASE_PATH + 'management/producers', FileSystemConfigration),
    Brands: new PouchDB<Brand>(DATABASE_PATH + 'management/brands', FileSystemConfigration),
    Products: new PouchDB<Product>(DATABASE_PATH + 'management/products', FileSystemConfigration),
    Categories: new PouchDB<Category>(DATABASE_PATH + 'management/categories', FileSystemConfigration),
    SubCategories: new PouchDB<SubCategory>(DATABASE_PATH + 'management/sub_categories', FileSystemConfigration),
    Campaings: new PouchDB<Campaign>(DATABASE_PATH + 'management/campaigns', FileSystemConfigration),
    Subscriptions: new PouchDB<OwnerSubscriptions>(DATABASE_PATH + 'management/subscriptions', FileSystemConfigration),
    Cards: new PouchDB<SafeCard>(DATABASE_PATH + 'management/cards', FileSystemConfigration),
    Logs: new PouchDB<Log>(DATABASE_PATH + 'management/logs', FileSystemConfigration),
    Sessions: new PouchDB<Session>(DATABASE_PATH + 'management/sessions', FileSystemConfigration),
    Aggreements: new PouchDB<AgreementData>(DATABASE_PATH + 'management/sessions', FileSystemConfigration)
}

export const StoresDB = {
    Infos: new PouchDB<Store>(DATABASE_PATH + 'store/info', FileSystemConfigration),
    Settings: new PouchDB<StoreSettings>(DATABASE_PATH + 'store/settings', FileSystemConfigration),
    Sessions: new PouchDB<Session>(DATABASE_PATH + 'store/sessions', FileSystemConfigration),
    Invoices: new PouchDB<Invoice>(DATABASE_PATH + 'store/invoices', FileSystemConfigration),
}

export const UtilsDB = {
    Otp: new PouchDB<OtpCheck>(DATABASE_PATH + 'utils/otp', FileSystemConfigration),
    Sms: new PouchDB<OtpCheck>(DATABASE_PATH + 'utils/sms', FileSystemConfigration),
}

export const AdressDB = {
    Countries: new PouchDB<any>(DATABASE_PATH + 'address/countries', FileSystemConfigration),
    States: new PouchDB<any>(DATABASE_PATH + 'address/cities', FileSystemConfigration),
    Provinces: new PouchDB<any>(DATABASE_PATH + 'address/provinces', FileSystemConfigration),
    Districts: new PouchDB<any>(DATABASE_PATH + 'address/districts', FileSystemConfigration),
    Streets: new PouchDB<any>(DATABASE_PATH + 'address/streets', FileSystemConfigration),
}

export const SocialDB = {
    Locations: new PouchDB(DATABASE_PATH + 'social/locations', FileSystemConfigration),
    Collections: new PouchDB(DATABASE_PATH + 'social/collections', FileSystemConfigration),
    Categories: new PouchDB(DATABASE_PATH + 'social/categories', FileSystemConfigration),
    Cuisines: new PouchDB(DATABASE_PATH + 'social/cuisines', FileSystemConfigration),
    Stores: new PouchDB(DATABASE_PATH + 'social/stores', FileSystemConfigration),
    Tables: new PouchDB(DATABASE_PATH + 'social/tables', FileSystemConfigration),
    Products: new PouchDB(DATABASE_PATH + 'social/products', FileSystemConfigration),
    Floors: new PouchDB(DATABASE_PATH + 'social/floors', FileSystemConfigration),
    Users: new PouchDB(DATABASE_PATH + 'social/users', FileSystemConfigration),
    Settings: new PouchDB(DATABASE_PATH + 'social/settings', FileSystemConfigration),
    Comments: new PouchDB(DATABASE_PATH + 'social/comments', FileSystemConfigration),
    Sessions: new PouchDB(DATABASE_PATH + 'social/sessions', FileSystemConfigration),
}

export const MenuDB = {
    Local: new PouchDB<Menu>(DATABASE_PATH + 'menu/local', FileSystemConfigration),
    Memory: new PouchDB<Menu>(DATABASE_PATH + 'menu/memory', InMemoryMenuConfigration),
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
        createIndexesForDatabase(Database, { index: { fields: ['db_name','check'] } }).then(res => {
            console.log('Indexing Finished Succesfully For Order Database');
        }).catch(err => {
            console.log('Indexing Throw Error For Order Database');
            console.error(err);
        })
        if (sync) {
            StoreDatabase.replicate.to(Database, { selector: { $or: [{ db_name: 'orders', check: name }, { db_name: 'receipts', check: name }] } }).then(isReplicated => {
                console.log('First Replication Status: ', isReplicated.ok, 'Docs Written: ', isReplicated.docs_written);
                Database.sync(StoreDatabase, { since: 'now', live: true, selector: { $or: [{ db_name: 'orders', check: name }, { db_name: 'receipts', check: name }] } })
                    .on('change', (changes) => {
                        console.log('Menu Changes ', changes.direction, changes.change.docs.length)
                    }).on('error', (err) => {
                        console.log(err);
                    })
            }).catch(err => {
                console.log(err);
            })
            StoreDatabase.changes({since: 'now', live: true, doc_ids:[name]}).on('change', (change) => {
                if(change.deleted){
                    console.log('Check Closed !')
                    Database.destroy().then(isClosed => {
                        console.log('OrderDB closed!',isClosed)
                        // Database.destroy().then(isKilled => {
                        //     console.log('OrderDB destroyed!')
                        // }).catch(err => {
                        //     console.log(err);
                        // });
                    }).catch(err => {
                        console.log(err);
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        }
        return Database;
    } catch (error) {
        console.log(error);
    }
}