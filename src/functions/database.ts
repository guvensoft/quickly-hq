import { Database, DatabaseUser, DatabaseU } from '../models/management/database';
import { CouchDB, ManagementDB, RemoteCollection } from '../configrations/database';
import { StoreAuth } from '../models/management/store';

export const createDatabaseUser = (username: string, password: string): DatabaseU => ({ _id: `org.couchdb.user:${username}`, name: username, password: password, type: 'user', roles: [] })

export const createIndexesForDatabase = (Database: PouchDB.Database, indexObj: PouchDB.Find.CreateIndexOptions) => Database.createIndex(indexObj);

export const createStoreDatabase = (storeAuth: StoreAuth) => {
    return new Promise<PouchDB.Core.DatabaseInfo>((resolve, reject) => {
        ManagementDB.Databases.get(storeAuth.database_id).then((DatabaseWillUse: Database) => {
            const DB = CouchDB(DatabaseWillUse).db;
            const RemoteCheck = RemoteCollection(DatabaseWillUse, storeAuth.database_name, storeAuth.database_user, storeAuth.database_password);
            const UsersDB = DB.use('_users');
            const newUser = new DatabaseUser(storeAuth.database_user, storeAuth.database_password);
            UsersDB.insert(newUser).then(() => {
                DB.create(storeAuth.database_name).then(() => {
                    DB.use(storeAuth.database_name).insert(newUser.secObject(), "_security").then(() => {
                        RemoteCheck.info().then(databaseInfo => {
                            resolve(databaseInfo);
                        }).catch((err) => {
                            reject(err)
                        });
                    }).catch(err => {
                        reject(err)
                    });
                }).catch(err => {
                    reject(err)
                });
            }).catch(err => {
                reject(err)
            });
        }).catch(err => {
            reject(err)
        });
    })
};


export const purgeDatabase = (storeAuth: StoreAuth) => {
    return new Promise<PouchDB.Core.DatabaseInfo>((resolve, reject) => {
        ManagementDB.Databases.get(storeAuth.database_id).then((DatabaseWillUse: Database) => {
            const DB = CouchDB(DatabaseWillUse);
            DB.db.destroy(storeAuth.database_name).then(isDeleted => {
                if (isDeleted.ok) {
                    createStoreDatabase(storeAuth).then(isOk => {
                        resolve(isOk);
                    }).catch(err => {
                        reject(err)
                    })
                } else {
                    reject(isDeleted);
                }
            }).catch(err => {
                reject(err)
            })
        })
    });
}


