import PouchDB from 'pouchdb-core'
import PouchDBFind from 'pouchdb-find';
import PouchDBInMemory from 'pouchdb-adapter-memory';
import PouchDBLevelDB from 'pouchdb-adapter-leveldb';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBInMemory);
PouchDB.plugin(PouchDBLevelDB);

const DatabaseConfigration = { revs_limit: 3, auto_compaction: true, adapter: 'leveldb' };

export const ManagementDB = {
    Users: new PouchDB('./db/management/users', DatabaseConfigration),
    Groups: new PouchDB('./db/management/groups', DatabaseConfigration),
    Databases: new PouchDB('./db/management/databases', DatabaseConfigration),
    Servers: new PouchDB('./db/management/servers', DatabaseConfigration),
    Accounts: new PouchDB('./db/management/accounts', DatabaseConfigration),
    Stores: new PouchDB('./db/management/stores', DatabaseConfigration),
    Logs: new PouchDB('./db/management/logs', DatabaseConfigration),
    Sessions: new PouchDB('./db/management/sessions', { revs_limit: 3, auto_compaction: true, adapter: 'memory' })
}