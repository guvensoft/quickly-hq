import { CouchDB, ManagementDB, RemoteDB } from '../configrations/database';
import { Database } from '../models/management/database';
import { Store } from '../models/social/stores';
import { readFile, exists } from 'fs';
import { Stock } from '../models/store/pos/stocks.mock';
import { backupPath } from '../configrations/paths';
import { BackupData, EndDay } from '../models/store/pos/endoftheday.mock';
import { Report } from '../models/store/pos/report.mock';
import { Cashbox } from '../models/store/pos/cashbox.mock';
import { ClosedCheck } from '../models/store/pos/check.mock';
import { Log } from '../models/store/pos/log.mock';

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
            // ManagementDB.Databases.get(Store.auth.database_id).then((database: any) => {
            //     const Database: Database = database;
            //     RemoteDB(Database, Store.auth.database_name).find({ selector: { db_name: 'tables' }, limit: 1000 }).then((db_res: any) => {
            //         const ready = db_res.docs.filter(obj => obj.status == 2);
            //         console.log(`${Store.name} ${ready.length}/${db_res.docs.length}`);
            //     });
            // })
        });
    });
}


export const StockCleaner = () => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        let remote = RemoteDB(db, 'kosmos-db15');



        remote.find({ selector: { db_name: 'stocks' }, limit: 1000 }).then((res: any) => {
            let untouchedStocks: Array<Stock> = res.docs;
            let stocks: Array<Stock> = untouchedStocks.map((element: Stock, index) => {
                element.left_total = 0;
                element.quantity = 0;
                element.first_quantity = 1;
                return element;
            });
            // let indexOfBols = stocks.findIndex(element => element.name.startsWith("Bols Sour Apple"));

            // console.log(indexOfBols);

            remote.bulkDocs(stocks).then(res => {
                console.log(res);

            }).catch(err => console.log(err));
        })


    })


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
    //         let coupon = res.docs.filter(obj => obj.payment_method == 'Kupon').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    //         let free = res.docs.filter(obj => obj.payment_method == 'İkram').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    //         let partial = res.docs.filter(obj => obj.payment_method == 'Parçalı')
    //         partial.forEach(element => {
    //             element.payment_flow.forEach(payment => {
    //                 if (payment.method == 'Nakit') {
    //                     nakit += payment.amount;
    //                 }
    //                 if (payment.method == 'Kart') {
    //                     kart += payment.amount;
    //                 }
    //                 if (payment.method == 'Kupon') {
    //                     coupon += payment.amount;
    //                 }
    //                 if (payment.method == 'İkram') {
    //                     free += payment.amount;
    //                 }
    //             })
    //         })
    //         console.log('Nakit:',nakit);
    //         console.log('Kart:',kart);
    //         console.log('Kupon:',coupon);
    //         console.log('İkram:',free);
    //     })
    // })
}

export const Fixer = () => {

    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res) => {
        let db = res.docs[0];

        RemoteDB(db, 'kosmos-db15').find({ selector: { db_name: 'endday' }, limit: 2500 }).then((res: any) => {
            let lastDay: EndDay = res.docs.sort((a, b) => b.timestamp - a.timestamp)[0];
            console.log(new Date(lastDay.timestamp).toDateString());
            return lastDay;
        }).then(lastDay => {

            RemoteDB(db, 'kosmos-db15').find({ selector: { db_name: 'checks' }, limit: 2500 }).then((res: any) => {
                // // res.docs.forEach(element => {
                // //     console.log(element.table_id, new Date(element.timestamp).toUTCString());
                // // });
                // // timestamp: { $gt: Date.now() }
                // res.docs = res.docs.sort((a, b) => a.timestamp - b.timestamp).map(obj => new Date(obj.timestamp));
                // res.docs.forEach((element: Date) => {
                //     console.log(element.getDay(),element.getHours());
                //     console.log
                // });


                let checks = res.docs;

                checks = checks.sort((a, b) => b.timestamp - a.timestamp);

                // checks.forEach(element => {
                //     console.log(new Date(element.timestamp).getDay());
                // });


                let newChecks = checks.filter(obj => obj.timestamp > lastDay.data_file.split('.')[0]);
                let oldChecks = checks.filter(obj => obj.timestamp < lastDay.data_file.split('.')[0]);

                console.log('Toplam', checks.length);
                console.log('Bugün', newChecks.length);
                console.log('Eski', oldChecks.length);


                // oldChecks.forEach((check, index) => {
                //     check.status = 1;
                //     RemoteDB(db, 'kosmos-db15').put(check).then(res => {
                //         console.log(check.name, 'updated');
                //     });
                // })

                oldChecks.forEach((check, index) => {
                    RemoteDB(db, 'kosmos-db15').remove(check).then(res => {
                        console.log(check._id, 'Removed');
                    });
                })


            })

        })


    })
}


export const DailySellingReport = () => {

    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        // RemoteDB(db, 'kosmos-db15').find({ selector: { db_name: 'endday' }, limit: 1000 }).then((res: any) => {
        //     let lastDay = res.docs.sort((a, b) => b.timestamp - a.timestamp)[0].timestamp;
        //     console.log(new Date(lastDay));

        RemoteDB(db, 'kosmos-db15').find({ selector: { db_name: 'closed_checks' }, limit: 2500 }).then((res: any) => {
            // // res.docs.forEach(element => {
            // //     console.log(element.table_id, new Date(element.timestamp).toUTCString());
            // // });
            // // timestamp: { $gt: Date.now() }
            // res.docs = res.docs.sort((a, b) => a.timestamp - b.timestamp).map(obj => new Date(obj.timestamp));
            // res.docs.forEach((element: Date) => {
            //     console.log(element.getDay(),element.getHours());
            //     console.log
            // });


            // BEKS! A-1-2-3-4 B-16 

            let checks = res.docs;

            // checks = checks.sort((a, b) => b.timestamp - a.timestamp);

            // let newChecks = checks.filter(obj => new Date(obj.timestamp).getDay() == 6);
            checks = checks.filter(obj => new Date(obj.timestamp).getDay() == new Date().getDay());

            // console.log(checks.length);
            // console.log(oldChecks.length);
            // console.log(newChecks.length);


            // oldChecks.forEach((check, index) => {
            //     check.status = 1;
            //     RemoteDB(db, 'kosmos-db15').put(check).then(res => {
            //         console.log(check.name, 'updated');
            //     });
            // })





            let cash = checks.filter(obj => obj.payment_method == 'Nakit').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
            let card = checks.filter(obj => obj.payment_method == 'Kart').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
            let coupon = checks.filter(obj => obj.payment_method == 'Kupon').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
            let free = checks.filter(obj => obj.payment_method == 'İkram').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
            let partial = checks.filter(obj => obj.payment_method == 'Parçalı')

            partial.forEach(element => {
                element.payment_flow.forEach(payment => {
                    if (payment.method == 'Nakit') {
                        cash += payment.amount;
                    }
                    if (payment.method == 'Kart') {
                        card += payment.amount;
                    }
                    if (payment.method == 'Kupon') {
                        coupon += payment.amount;
                    }
                    if (payment.method == 'İkram') {
                        free += payment.amount;
                    }
                })
            })

            console.log('Nakit:', cash);
            console.log('Kart:', card);
            console.log('Kupon:', coupon);
            console.log('İkram:', free);
            console.log('Toplam', cash + card + coupon);
        })
    })

}

export const readJsonFile = (file_path: string) => {
    return new Promise((resolve, reject) => {
        exists(file_path, (exists) => {
            if (exists) {
                readFile(file_path, (err, data) => {
                    if (!err) {
                        let buffer = data.toString('utf8');
                        let json_data = JSON.parse(buffer);
                        resolve(json_data);
                    } else {
                        reject('Dosya Okunurken Hata Oluştu.');
                    }
                });
            } else {
                reject('Dosya Bulunamadı');
            }
        });
    });

}


export const BackupReportGenerator = () => {
    readJsonFile(backupPath + 'db.dat').then((res: Array<any>) => {
        let enddays: Array<EndDay> = res.filter(obj => obj.db_name == 'endday').filter((obj) => new Date(obj.timestamp).getDate() == 14 && new Date(obj.timestamp).getMonth() == 6);
        let categories = res.filter(obj => obj.db_name == 'categories');
        let sub_categories = res.filter(obj => obj.db_name == 'sub_categories');

        enddays.forEach(day => {
            // if (new Date(day.timestamp).getDay() == 0) {
            readJsonFile(backupPath + 'backup/' + day.data_file).then((data: Array<BackupData>) => {

                let reports: Array<Report> = data.find(obj => obj.database == 'reports').docs;
                let closed_checks: Array<ClosedCheck> = data.find(obj => obj.database == 'closed_checks').docs;
                let cashbox: Array<Cashbox> = data.find(obj => obj.database == 'cashbox').docs;
                let logs: Array<Log> = data.find(obj => obj.database == 'logs').docs;

                console.log('---------------------------------');
                console.log(new Date(day.timestamp).toLocaleString('tr-TR'));
                console.log('Raporlar', reports.length);
                console.log('Kasa', cashbox.length);
                console.log('Hesaplar', closed_checks.length);
                console.log('Kayıtlar', logs.length);
                console.log('---------------------------------');

                // closed_checks.forEach(check => {
                //     console.log(check.total_price, check.payment_method);
                // })


                // reports = reports.filter(report => report.type == 'Product')
                // console.log(reports[0]);
            }).catch(err => {

            })
            // }
        })
    })

}

export const thatDay = () => {

    let day = '1560560187590.qdat';
    readJsonFile(backupPath + 'backup/' + day).then((data: Array<BackupData>) => {

        let reports: Array<Report> = data.find(obj => obj.database == 'reports').docs;
        let closed_checks: Array<ClosedCheck> = data.find(obj => obj.database == 'closed_checks').docs;
        let cashbox: Array<Cashbox> = data.find(obj => obj.database == 'cashbox').docs;
        let logs: Array<Log> = data.find(obj => obj.database == 'logs').docs;

        logs = logs.sort((a, b) => a.timestamp - b.timestamp).filter(obj => obj.connection_id == 'b24b55f0-7b30-4657-9f0f-aeb0317b525a')
        logs.forEach(log => {
            // if (log.type) {
            console.log('                ');
            console.log('----------------------------------------------------------------------');
            console.log(new Date(log.timestamp).toLocaleTimeString('tr'))
            console.log('Tür', log.type);
            console.log(log.user);
            console.log(log.description);
            console.log('----------------------------------------------------------------------');
            // }
        })


        let b13 = closed_checks.filter(obj => obj.table_id == '675c4637-d503-4d29-8df5-11f678b30f09');

        b13.forEach((check, index) => {
            console.log(index)

            console.log(check)

            70 + 14.5 + 60 + 3 + 110

            // if(check.payment_method == 'Parçalı'){
            //     check.payment_flow.forEach(obj => {
            //         console.log(obj)
            //     })
            // }
        })

    })


}


export const veryOldUpdate = () => {


    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];

        RemoteDB(db, 'kosmos-db15').find({ selector: { db_name: 'reports', type: 'Product' }, limit: 2500 }).then((res: any) => {

            // let test = res.docs.map(obj => obj.weekly_count[1]);
            // console.log(test);

            // let endday = res.docs;
            // endday.forEach(element => {

            //     let time = element.time;
            //     delete element.time;
            //     element.timestamp = time;

            //     RemoteDB(db, 'dilek-pastanesi-9da1').put(element).then(res => {
            //         console.log(new Date(element.timestamp).toDateString(), 'updated');
            //     }).catch(err => {
            //         console.error(new Date(element.timestamp).toDateString(), 'error');
            //     });

            // });



            // let stocks = res.docs;
            // stocks.forEach(element => {

            //     element.warning_value = 25;

            //     RemoteDB(db, 'dilek-pastanesi-9da1').put(element).then(res => {
            //         console.log(new Date(element.timestamp).toDateString(), 'updated');
            //     }).catch(err => {
            //         console.error(new Date(element.timestamp).toDateString(), 'error');
            //     });

            // });


            // let products = res.docs;
            // products.forEach(element => {

            //     element.tax_value = 8;
            //     element.barcode = 0;

            //     RemoteDB(db, 'dilek-pastanesi-9da1').put(element).then(res => {
            //         console.log(element.name, 'updated');
            //     }).catch(err => {
            //         console.error(element.name, 'error');
            //     });

            // });

        })
    })
}



export const MoveData = () => {


    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];

        RemoteDB(db, 'quickly-cafe-130c').find({ selector: { db_name: 'stocks_cat' }, limit: 2500 }).then((res: any) => {
            return res.docs;
        }).then(stocks => {
            // console.log(stocks);
            RemoteDB(db, 'kosmos-db15').bulkDocs(stocks).then(res => {
                console.log('Stocks Added');
            })
        })



    })
}
