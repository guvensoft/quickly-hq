import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
import { ManagementDB, RemoteDB, SocialDB } from '../configrations/database';
import { Store } from '../models/management/store';
import { Database } from '../models/management/database';
import { Table } from '../models/social/tables';

if (isMainThread) {

    let Stores: Array<Store> = [];
    let Databases: Array<Database> = [];

    const storesPromise = ManagementDB.Stores.find({ selector: {}, limit:1000 }).then(res => {
        Stores = res.docs;
    }).catch(err => {
        console.log(err);
    })
    const databasePromises = ManagementDB.Databases.find({ selector: {} }).then(res => {
        Databases = res.docs;
    }).catch(err => {
        console.log(err);
    })

    Promise.all([storesPromise, databasePromises]).then(res => {
        const worker = new Worker(__filename, { workerData: { databases: Databases, stores: Stores } });
        worker.on('message', (activity: Table) => {
            // SocialDB.Tables.get(updatedTable._id).then(res => {
            //     SocialDB.Tables.put({ res, ...updatedTable }).catch(err => {
            //         //// Update Error
            //     })
            // }).catch(err => {
            //     SocialDB.Tables.post(updatedTable).catch(err => {
            //         //// Post Error
            //     })
            // })
            console.log(activity);
        });
        worker.on('error', (error) => {

        });
        worker.on('exit', (code) => {
            if (code !== 0)
                throw new Error(`Logs Worker stopped with exit code ${code}`);
        });
    });

} else {

    workerData.stores.forEach((store: Store) => {
        console.log(`Logs Listener Attached to ${store.name} at ${store.auth.database_name}`);
        RemoteDB(workerData.databases.find(db => db._id == store.auth.database_id), store.auth.database_name)
            .changes({ since: 'now', live: true, include_docs: true })
            .on('change', (changes: any) => {
                if (changes.doc.db_name == 'logs') {
                    // let socialTable: Table = {
                    //     _id: changes.doc._id,
                    //     name: changes.doc.name,
                    //     store_id: store._id,
                    //     floor_id: changes.doc.floor_id,
                    //     capacity: changes.doc.capacity,
                    //     status: changes.doc.status,
                    // }
                    parentPort.postMessage(store.name + ' ' + changes.doc.description + ' ' + new Date(changes.doc.timestamp).toTimeString());
                }
            })
            .on('error', (error) => {
                console.log(`Logs Worker can't Access StoreDB of ${store.name} at ${store.auth.database_name}`);
            })
    });

}