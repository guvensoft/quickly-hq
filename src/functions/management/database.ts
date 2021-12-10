import { Database, DatabaseUser, DatabaseU } from '../../models/management/database';
import { CouchDB, ManagementDB, RemoteCollection, StoreDB } from '../../configrations/database';
import { StoreAuth, Store } from '../../models/management/store';

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
                            console.log('New Database Connection Error:',err.reason)
                            reject(err)
                        });
                    }).catch(err => {
                        console.log('Database User Not Inserted!:',err.reason)
                        reject(err)
                    });
                }).catch(err => {
                    console.log('New Database Not Created!:',err.reason)
                    reject(err)
                });
            }).catch(err => {
                console.log('User Exist! - Old User will be owner again..!')
                DB.create(storeAuth.database_name).then(() => {
                    DB.use(storeAuth.database_name).insert(newUser.secObject(), "_security").then(() => {
                        RemoteCheck.info().then(databaseInfo => {
                            resolve(databaseInfo);
                        }).catch((err) => {
                            console.log('New Database Connection Error:',err.reason)
                            reject(err)
                        });
                    }).catch(err => {
                        console.log('Database User Not Inserted!:',err.reason)
                        reject(err)
                    });
                }).catch(err => {
                    console.log('New Database Not Created!:',err.reason)
                    reject(err)
                });
            });
        }).catch(err => {
            console.log('Store Not Found!:')
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
                        console.log('New Database Not Created!:', err.reason)
                        reject(err)
                    })
                } else {
                    console.log('Database Not Destroyed!:', isDeleted)
                    reject(isDeleted);
                }
            }).catch(err => {
                console.log('Database Destroy Process Fault!:', err.reason)
                reject(err);
            })
        })
    });
}


export const clearStoreDatabase = async (store_id: string) => {
    try {
        const Store: Store = await ManagementDB.Stores.get(store_id);
        const StoreDatabase = await StoreDB(store_id);
        const StoreDocuments = (await StoreDatabase.find({selector:{},limit:10000})).docs.map(obj => {
            delete obj._rev;
            return obj;
        });
        console.log(StoreDocuments[0])
        console.log('Docs Count:', StoreDocuments.length);
        return purgeDatabase(Store.auth).then(res => {
            StoreDatabase.bulkDocs(StoreDocuments).then(docs => {
                let isAnyConflict = docs.some(doc => doc.hasOwnProperty('error'));
                if(isAnyConflict){
                    console.log('There Are Some Conflicts')
                }else{
                    console.log('Looks Great')
                    return true;
                }
            })
        }).catch(err => {
            console.log(err);
        })
    } catch (error) {
        console.log(error);
    }
}



