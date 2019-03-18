import { CouchDB, ManagementDB, RemoteDB } from '../configrations/database';
import { Database } from '../models/management/database';
import { Store } from '../models/social/stores';


export const TableWorker = () => {
    ManagementDB.Databases.find({ selector: {} }).then((databases: any) => {
        const Databases: Database[] = databases.docs;
        Databases.forEach(db_server => {
            CouchDB(db_server).db.list().then((db_list: Array<string>) => {
                db_list = db_list.filter(obj => obj.charAt(0) !== '_');
                db_list.forEach(db_name => {
                    RemoteDB(db_server, db_name).find({ selector: { db_name: 'tables', status: 2 }, limit: 1000 }).then((res: any) => {
                        console.log(db_name, res.docs.length, ' Açık Masa');
                    });
                });
            }).catch(err => {
                console.log('TEST');
            });
        });
    });
};


export const TablesWorker = () => {
    ManagementDB.Stores.find({ selector: {}, limit: 1000 }).then((db_res: any) => {
        const Stores: Array<Store> = db_res.docs;
        Stores.forEach(Store => {
            ManagementDB.Databases.get(Store.auth.database_id).then((database: any) => {
                const Database: Database = database;
                RemoteDB(Database, Store.auth.database_name).find({ selector: { db_name: 'tables' }, limit: 1000 }).then((db_res: any) => {
                    const ready = db_res.docs.filter(obj => obj.status == 2);
                    console.log(`${Store.name} ${ready.length}/${db_res.docs.length}`);
                });
            })
        });
    });
}





export const Logs = () => {


    // ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
    //     let db: Database = res.docs[0];
    //     RemoteDB(db, 'simitci-dunyas-6bd4').find({ selector: { db_name: 'products', cat_id: '5b436558-cad3-4649-b68b-fa9a5b87352c' }, limit: 1000 }).then((res: any) => {
    //         console.log(res);
    //     })
    // })

    // ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
    //     let db: Database = res.docs[0];
    //     RemoteDB(db, 'kosmos-db15').find({ selector: { db_name: 'cashbox'}, limit: 1000 }).then((res: any) => {
    //         res.docs.forEach(element => {
    //            console.log(new Date(element.timestamp).getDate()); 
    //         });

    //         // let past = res.docs.filter(({timestamp}) => new Date(timestamp).getDate() == 23 );
    //         // let today = res.docs.filter(({timestamp}) => new Date(timestamp).getDate() == 24 ).map(obj => obj.table_id);

    //         // console.log(today);
    //     })
    // })



    // ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
    //     let db: Database = res.docs[0];
    //     RemoteDB(db, 'kosmos-db15').find({ selector: { db_name: 'closed_checks' }, limit: 1000 }).then((res: any) => {
    //         // , timestamp: { $gt: Date.now() }
    //         // res.docs = res.docs.sort((a, b) => a.timestamp - b.timestamp).map(obj => new Date(obj.timestamp));
    //         // res.docs.forEach((element: Date) => {
    //         //     console.log(element.getDay(),element.getHours());
    //         // });
    //         let nakit = res.docs.filter(obj => obj.payment_method == 'Nakit').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    //         let kart = res.docs.filter(obj => obj.payment_method == 'Kart').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    //         let kupon = res.docs.filter(obj => obj.payment_method == 'Kupon').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    //         let ikram = res.docs.filter(obj => obj.payment_method == 'İkram').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    //         let parçali = res.docs.filter(obj => obj.payment_method == 'Parçalı')
    //         parçali.forEach(element => {
    //             element.payment_flow.forEach(payment => {
    //                 if (payment.method == 'Nakit') {
    //                     nakit += payment.amount;
    //                 }
    //                 if (payment.method == 'Kart') {
    //                     kart += payment.amount;
    //                 }
    //                 if (payment.method == 'Kupon') {
    //                     kupon += payment.amount;
    //                 }
    //                 if (payment.method == 'İkram') {
    //                     ikram += payment.amount;
    //                 }
    //             })
    //         })
    //         console.log('Nakit:',nakit);
    //         console.log('Kart:',kart);
    //         console.log('Kupon:',kupon);
    //         console.log('İkram:',ikram);
    //     })
    // })
}