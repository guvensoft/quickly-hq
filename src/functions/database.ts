import { Database, DatabaseUser } from '../models/management/database';
import { CouchDB, ManagementDB, RemoteCollection } from '../configrations/database';
import { StoreAuth } from '../models/management/store';

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


export const moveStoreDatabase = () => {
    return new Promise((resolve, reject) => {





    });
}