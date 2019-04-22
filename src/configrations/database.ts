import Nano from 'nano';
import PouchDB from 'pouchdb-core'
import PouchDBFind from 'pouchdb-find';
import PouchDBInMemory from 'pouchdb-adapter-memory';
import PouchDBLevelDB from 'pouchdb-adapter-leveldb';
import PouchDBHttp from 'pouchdb-adapter-http';
import { Database } from '../models/management/database';
import { Store } from '../models/social/stores';
import { User, Group } from '../models/management/users';
import { Account } from '../models/management/account';
import { Owner } from '../models/management/owner';
import { Log } from '../utils/logger';
import { AuthObject } from '../models/management/auth';
import { databasePath } from './paths';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBInMemory);
PouchDB.plugin(PouchDBLevelDB);
PouchDB.plugin(PouchDBHttp);

const DatabaseConfigration = { revs_limit: 3, auto_compaction: true, adapter: 'leveldb' };

export const ManagementDB = {
    Users: new PouchDB<User>(databasePath + 'management/users', DatabaseConfigration),
    Groups: new PouchDB<Group>(databasePath + 'management/groups', DatabaseConfigration),
    Databases: new PouchDB<Database>(databasePath + 'management/databases', DatabaseConfigration),
    Accounts: new PouchDB<Account>(databasePath + 'management/accounts', DatabaseConfigration),
    Owners: new PouchDB<Owner>(databasePath + 'management/owners', DatabaseConfigration),
    Stores: new PouchDB<Store>(databasePath + 'management/stores', DatabaseConfigration),
    Logs: new PouchDB<Log>(databasePath + 'management/logs', DatabaseConfigration),
    Sessions: new PouchDB<AuthObject>(databasePath + 'management/sessions', { revs_limit: 3, auto_compaction: true, adapter: 'memory' })
}

export const StoreDB = {
    Settings: new PouchDB(databasePath + 'store/settings', DatabaseConfigration),
    Sessions: new PouchDB<AuthObject>(databasePath + 'store/sessions', { revs_limit: 3, auto_compaction: true, adapter: 'memory' })
}

export const SocialDB = {
    Locations: new PouchDB(`./db/social/locations`, DatabaseConfigration),
    Collections: new PouchDB(`./db/social/collections`, DatabaseConfigration),
    Categories: new PouchDB(`./db/social/categories`, DatabaseConfigration),
    Cuisines: new PouchDB(`./db/social/cuisines`, DatabaseConfigration),
    Stores: new PouchDB(`./db/social/stores`, DatabaseConfigration),
    Tables: new PouchDB(`./db/social/tables`, DatabaseConfigration),
    Products: new PouchDB(`./db/social/products`, DatabaseConfigration),
    Floors: new PouchDB(`./db/social/floors`, DatabaseConfigration),
    Users: new PouchDB(`./db/social/users`, DatabaseConfigration),
    Settings: new PouchDB(`./db/social/settings`, DatabaseConfigration),
    Comments: new PouchDB(`./db/social/comments`, DatabaseConfigration),
    Sessions: new PouchDB(`./db/social/sessions`, DatabaseConfigration),
}

export const CouchDB = (database: Database) => {
    return Nano(`http://${database.username}:${database.password}@${database.host}:${database.port}`);
}

export const RemoteDB = (database: Database, collection: string) => {
    return new PouchDB(`http://${database.username}:${database.password}@${database.host}:${database.port}/${collection}`, { adapter: 'http' });
}

export const RemoteCollection = (database: Database, collection: string, username: string, password: string) => {
    return new PouchDB(`http://${username}:${password}@${database.host}:${database.port}/${collection}`, { adapter: 'http' });
}

export const StoreCollection = async (store_id: any) => {
    let Store: Store = await ManagementDB.Stores.get(store_id);
    let Database: Database = await ManagementDB.Databases.get(Store.auth.database_id);
    return RemoteDB(Database, Store.auth.database_name);
}

export const DatabaseQueryLimit = 1000;