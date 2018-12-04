import PouchDB from 'pouchdb-core';
import PouchDBFind from 'pouchdb-find';
import PouchDBInMemory from 'pouchdb-adapter-memory';
import PouchDBLevelDB from 'pouchdb-adapter-leveldb';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBInMemory);
PouchDB.plugin(PouchDBLevelDB);

const DatabaseConfigration = { revs_limit: 3, auto_compaction: true, adapter: 'leveldb' };

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