import Nano from 'nano';
import PouchDB from 'pouchdb-core';
import PouchDBFind from 'pouchdb-find';
import PouchDBHttp from 'pouchdb-adapter-http';
import { Database } from '../models/management/database';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBHttp);

export const CouchDB = (database: Database) => {
    return Nano(`http://${database.username}:${database.password}@${database.host}:${database.port}`);
}

export const RemoteDB = (database: Database, collection: string) => {
    return new PouchDB(`http://${database.username}:${database.password}@${database.host}:${database.port}/${collection}`, { adapter: 'http' });
}