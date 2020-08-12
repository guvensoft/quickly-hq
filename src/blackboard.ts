import { CouchDB, ManagementDB, RemoteDB, StoresDB, StoreDB, DatabaseQueryLimit } from './configrations/database';
import { Database } from './models/management/database';
import { Store } from './models/management/store';
import { Stock, StockTransfer } from './models/store/pos/stocks';
import { backupPath, documentsPath, reisPath } from './configrations/paths';
import { BackupData, EndDay } from './models/store/pos/endoftheday';
import { Report, createReport } from './models/store/pos/report';
import { Cashbox } from './models/store/pos/cashbox';
import { ClosedCheck, CheckProduct, Check, CheckType } from './models/store/pos/check';
import { Log, logType } from './models/store/pos/log';
import { readJsonFile, writeJsonFile } from './functions/files';
import { writeFile, readFile, readFileSync } from 'fs';
import { Product } from './models/management/product';
import path from 'path';
import { createIndexesForDatabase } from './functions/database';
import { object, string } from 'joi';

import { Parser } from 'xml2js';
import { Table, TableStatus } from './models/store/pos/table';

// import { productToStock } from 'src/functions/stocks';

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

export const reloadTable = (db_name: string) => {

    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        RemoteDB(db, db_name).find({ selector: { db_name: 'tables' } }).then((res: any) => {
            let tables = res.docs;
            tables.map(obj => {
                delete obj._rev;
                return obj;
            });
            RemoteDB(db, db_name).bulkDocs(tables).then(res => {
                console.log('Tables Successfuly Reoladed...!');
            }).catch(err => {
                console.log(err);
            })
        })
    })


}

export const fixTables = async (db_name: string) => {

    let db: Database = (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
    let checks: Array<Check> | any = (await RemoteDB(db, db_name).find({ selector: { db_name: 'checks', type: CheckType.NORMAL } })).docs;
    let tables: Array<Table> | any = (await RemoteDB(db, db_name).find({ selector: { db_name: 'tables', status: TableStatus.OCCUPIED } })).docs;

    checks.forEach(async (check: Check) => {
        try {
            let tableWillFix: Check = await RemoteDB(db, db_name).get(check.table_id);
            tableWillFix.status = 2;
            let isUpdated = await RemoteDB(db, db_name).put(tableWillFix);
            console.log(isUpdated);
        } catch (error) {
            console.log(error);
        }
    });

    // tables.forEach(async (table: Table) => {
    //     try {
    //         let isEverythingNormal = checks.includes(obj => obj.table_id == table._id);
    //         if (!isEverythingNormal) {
    //             table.status = 1;
    //             let isUpdated = await RemoteDB(db, db_name).put(table);
    //             console.log(isUpdated);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // });

    // RemoteDB(db, db_name).bulkDocs(tables).then(res => {
    //     console.log('Tables Successfuly Reoladed...!');
    // }).catch(err => {
    //     console.log(err);
    // })
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

export const Fixer = (db_name: string) => {

    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res) => {
        let db = res.docs[0];

        RemoteDB(db, db_name).find({ selector: { db_name: 'endday' }, limit: 2500 }).then((res: any) => {
            let lastDay: EndDay = res.docs.sort((a, b) => b.timestamp - a.timestamp)[0];
            console.log(new Date(lastDay.timestamp).toDateString());
            return lastDay;
        }).then(lastDay => {
            let databasesWillFix = ['closed_checks', 'checks', 'logs', 'cashbox'];
            databasesWillFix.forEach(selectedDatabase => {
                RemoteDB(db, db_name).find({ selector: { db_name: selectedDatabase }, limit: 2500 }).then((res: any) => {
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
                    //     console.log(new Date(element.timestampFixer).getDay());
                    // });

                    let dayThat = lastDay.data_file.split('.')[0];

                    let newChecks = checks.filter(obj => obj.timestamp > dayThat);
                    let oldChecks = checks.filter(obj => obj.timestamp < dayThat);

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
                        RemoteDB(db, db_name).remove(check).then(res => {
                            console.log(check._id, 'Silindi');
                        });
                    })


                })
            });
        })
    })
}


export const DailySalesReport = (store_db_name: string) => {

    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        // RemoteDB(db, 'kosmos-db15').find({ selector: { db_name: 'endday' }, limit: 1000 }).then((res: any) => {
        //     let lastDay = res.docs.sort((a, b) => b.timestamp - a.timestamp)[0].timestamp;
        //     console.log(new Date(lastDay));

        // RemoteDB(db, 'kosmos-db15').find({ selector: { db_name: 'checks' }, limit: 2500 }).then(res => {
        //     console.log()
        // })

        RemoteDB(db, store_db_name).find({ selector: { db_name: 'closed_checks' }, limit: 2500 }).then((res: any) => {
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
            // checks = checks.filter(obj => new Date(obj.timestamp).getDay() == new Date().getDay());


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

export const ReportsFixer = async (db_name) => {
    try {
        const db = await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } });
        const products: any = await RemoteDB(db.docs[0], db_name).find({ selector: { db_name: 'products' }, limit: 2500 });
        const reports = await RemoteDB(db.docs[0], db_name).find({ selector: { db_name: 'reports', type: 'products' }, limit: 2500 });
        let reportsWillUpdate: Array<any> = reports.docs;
        if (reportsWillUpdate.length > 0) {
            reportsWillUpdate.map((report: any) => {
                try {
                    report.description = products.docs.find(obj => obj._id == report.connection_id).name;
                } catch (error) {
                    RemoteDB(db.docs[0], db_name).remove(report).then(res => {
                        console.log('UNUSED REPORT DELETED', report)
                    }).catch(err => {
                        console.log('Remote Connection Error');
                    })
                }
            });
        } else {
            products.docs.forEach(product => {
                let newReport = createReport('Product', product);
                reportsWillUpdate.push(newReport);
            });
        }

        RemoteDB(db.docs[0], db_name).bulkDocs(reportsWillUpdate).then(response => {
            console.log(response);
        }).catch(err => {
            console.log(err);
        })
    } catch (error) {
        console.error(error);
    }

}

export const BackupReportGenerator = () => {
    readJsonFile(backupPath + 'db.dat').then((res: Array<any>) => {
        let enddays: Array<EndDay> = res.filter(obj => obj.db_name == 'endday').sort((a, b) => b.timestamp - a.timestamp).filter(obj => new Date(obj.timestamp).getDay() == 4);
        let categories = res.filter(obj => obj.db_name == 'categories');
        let sub_categories = res.filter(obj => obj.db_name == 'sub_categories');

        let balanced = 0;
        let checks_balanced = 0;
        enddays.forEach(day => {
            readJsonFile(backupPath + 'backup/' + day.data_file).then((data: Array<BackupData>) => {

                let reports: Array<Report> = data.find(obj => obj.database == 'reports').docs;
                let closed_checks: Array<ClosedCheck> = data.find(obj => obj.database == 'closed_checks').docs;
                let cashbox: Array<Cashbox> = data.find(obj => obj.database == 'cashbox').docs;
                let logs: Array<Log> = data.find(obj => obj.database == 'logs').docs;

                console.log('---------------------------------');
                console.log(new Date(day.timestamp).toLocaleDateString('tr-TR'));
                // console.log('Raporlar', reports.length);
                // console.log('Kasa', cashbox.length);
                // console.log('Hesaplar', closed_checks.length);
                // console.log('Kayıtlar', logs.length);
                console.log('---------------------------------');

                let requests = logs.filter(obj => obj.description.match('ödeme'));

                // console.log('İstek', requests.length);

                balanced += requests.length;

                // checks_balanced += closed_checks.length;

                console.log('Request', balanced / enddays.length);
                // console.log('Checks', checks_balanced / enddays.length);



                // closed_checks.forEach(check => {
                //     console.log(check.total_price, check.payment_method);
                // })


                // reports = reports.filter(report => report.type == 'Product')
                // console.log(reports[0]);
            }).catch(err => {
                console.log(err);
            })
        })
    })

}

export const thatDay = () => {

    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        RemoteDB(db, 'kosmos-db15').find({ selector: { db_name: 'endday' }, limit: 2500 }).then((res: any) => {
            let lastDay: EndDay = res.docs.sort((a, b) => b.timestamp - a.timestamp)[0];
            return lastDay.data_file;
        }).then(day => {
            day = '1578348025122.qdat';
            console.log(new Date(1578348025122));

            readJsonFile(backupPath + 'backup/' + day).then((data: Array<BackupData>) => {

                let reports: Array<Report> = data.find(obj => obj.database == 'reports').docs;
                let closed_checks: Array<ClosedCheck> = data.find(obj => obj.database == 'closed_checks').docs;
                let cashbox: Array<Cashbox> = data.find(obj => obj.database == 'cashbox').docs;
                let logs: Array<Log> = data.find(obj => obj.database == 'logs').docs;

                // console.log(logs);

                // let cash = closed_checks.filter(obj => obj.payment_method == 'Nakit').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                // let card = closed_checks.filter(obj => obj.payment_method == 'Kart').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                // let coupon = closed_checks.filter(obj => obj.payment_method == 'Kupon').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                // let free = closed_checks.filter(obj => obj.payment_method == 'İkram' && obj.type == 1).map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                // let canceled = closed_checks.filter(obj => obj.payment_method == 'İkram' && obj.type == 3).map(obj => obj.total_price).reduce((a, b) => a + b, 0);
                // let partial = closed_checks.filter(obj => obj.payment_method == 'Parçalı')

                // partial.forEach(element => {
                //     element.payment_flow.forEach(payment => {
                //         if (payment.method == 'Nakit') {
                //             cash += payment.amount;
                //         }
                //         if (payment.method == 'Kart') {
                //             card += payment.amount;
                //         }
                //         if (payment.method == 'Kupon') {
                //             coupon += payment.amount;
                //         }
                //         if (payment.method == 'İkram') {
                //             free += payment.amount;
                //         }
                //     })
                // })

                // let outcome = cashbox.map(obj => obj.cash).reduce((a, b) => a + b, 0);
                // let discount = closed_checks.map(obj => obj.discount).reduce((a, b) => a + b, 0);


                // console.log('Nakit:', Math.floor(cash), 'TL');
                // console.log('Kart:', Math.floor(card), 'TL');
                // console.log('Kupon:', Math.floor(coupon), 'TL');
                // console.log('İkram:', Math.floor(free), 'TL');
                // console.log('İptal:', Math.floor(canceled), 'TL');
                // console.log('İndirim:', Math.floor(discount), 'TL');
                // console.log('Gider:', Math.floor(outcome), 'TL');
                // console.log('Toplam', Math.floor(cash + card + coupon), 'TL');

                logs = logs.sort((a, b) => a.timestamp - b.timestamp).filter(obj => obj.type === 7);

                logs.forEach(log => {
                    console.log('                ');
                    console.log('----------------------------------------------------------------------');
                    console.log(new Date(log.timestamp).toLocaleTimeString('tr'))
                    console.log('Tür', log.type);
                    console.log(log.user);
                    console.log(log.description);
                    console.log('----------------------------------------------------------------------');
                })


                // let b13 = closed_checks.filter(obj => obj.table_id == '675c4637-d503-4d29-8df5-11f678b30f09');

                // b13.forEach((check, index) => {
                //     console.log(index)

                //     console.log(check)

                //     70 + 14.5 + 60 + 3 + 110

                //     // if(check.payment_method == 'Parçalı'){
                //     //     check.payment_flow.forEach(obj => {
                //     //         console.log(obj)
                //     //     })
                //     // }
                // })

            })
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
}

export const allRevisions = (db_name: string, doc_id: string) => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        RemoteDB(db, db_name).get(doc_id, { revs_info: true }).then(res => {
            console.log(res);
            res._revs_info.filter(rev => rev.status == "available").forEach(obj => {
                RemoteDB(db, db_name).get(doc_id, { rev: obj.rev }).then((res: any) => {
                    console.log(res.products.length);
                });
            })
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    })
}

export const databaseLogs = (db_name: string, search: string) => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        RemoteDB(db, db_name).find({ selector: { db_name: 'logs' }, limit: 2500 }).then(res => {
            let logs: any = res.docs;
            let regex = new RegExp(search, 'i');
            let results: Array<any> = logs.filter(obj => obj.description.match(regex)).sort((a, b) => a.timestamp - b.timestamp).filter(obj => obj.type == 5);
            results.forEach(log => console.log(log.type, new Date(log.timestamp).getDate(), log.user + ' ' + log.description, log.description.replace(search, '').replace(/\D/g, "") + ' TL        '));
        })
    }).catch(err => {
        console.log(err);
    }).catch(err => {
        console.log(err);
    })
}


export const veryOldUpdate = () => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];


        RemoteDB(db, 'goches-coffee-18fa').find({ selector: { db_name: 'products' }, limit: 2500 }).then((res: any) => {

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


            let products = res.docs;
            products.forEach(element => {

                element.tax_value = 8;
                element.barcode = 0;

                RemoteDB(db, 'goches-coffee-18fa').put(element).then(res => {
                    console.log(element.name, 'updated');
                }).catch(err => {
                    console.error(element.name, 'error');
                });

            });

        })
    })
}


export const getProducts = (store_id) => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        readJsonFile(__dirname + 'tete.json').then((productsJson: Array<Product>) => {
            RemoteDB(db, 'mansion-cafe-restaurant-4b24').find({ selector: { db_name: 'products' }, limit: 2500 }).then(db_products => {

                productsJson.map(product => {
                    try {
                        let newRev = db_products.docs.find(obj => obj._id == product._id)._rev;
                        product._rev = newRev;
                    } catch (error) {
                        // console.log(error);
                    }
                });

                RemoteDB(db, 'mansion-cafe-restaurant-4b24').bulkDocs(productsJson).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.error(err);
                })
                // console.log(products);

            }).catch(err => {
                console.error(err);
            })


        })
    })
}

export const documentTransport = (from: string, to: string, selector: any, type: 'fetch' | 'update') => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        if (type == 'update') {
            RemoteDB(db, to).find({ selector: selector, limit: 2500 }).then(res => {
                let orginalDocs = res.docs;
                RemoteDB(db, from).find({ selector: selector, limit: 2500 }).then((res2: any) => {
                    return res2.docs.map(obj => {
                        let originalDoc = orginalDocs.find(doc => doc._id == obj._id);
                        if (originalDoc) {
                            obj._rev = originalDoc._rev;
                        }
                        return obj;
                    });
                }).then(documents => {
                    RemoteDB(db, to).bulkDocs(documents).then(res3 => {
                        console.log('Document Moved Successfuly');
                    }).catch(err => {
                        console.log(err);
                    })
                })

            })
        } else if (type == 'fetch') {
            RemoteDB(db, from).find({ selector: selector, limit: 2500 }).then((res: any) => {
                return res.docs.map(obj => {
                    delete obj._rev;
                    return obj;
                });
            }).then(documents => {
                RemoteDB(db, to).bulkDocs(documents).then(res => {
                    console.log(res);
                    console.log('Document Moved Successfuly');
                })
            })
        }
    })
}

export const MoveData = () => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        RemoteDB(db, 'kent-besiktas-8e12').find({ selector: { db_name: 'tables' }, limit: 2500 }).then((res: any) => {
            return res.docs.map(obj => {
                delete obj._rev;
                delete obj._id;
                return obj;
            });
        }).then(documents => {
            RemoteDB(db, 'quickly-cafe-130c').bulkDocs(documents).then(res => {
                console.log('Document Moved Successfuly');
            })
        })
    })
}

export const addProperty = () => {
    // let position = { height: 75, width: 75, x: 100, y: 100, type: 0 };

    let tables = [{
        "timestamp": 1596809614562,
        "db_seq": 2,
        "db_name": "tables",
        "capacity": 1,
        "status": 1,
        "name": "AltBar-2",
        "description": null,
        "customers": [],
        "floor_id": "4f23cfaa-92db-4059-b269-fe901c24bf30",
        "position": {
            "x": 31,
            "y": 126,
            "height": 80,
            "width": 120
        },
        "_id": "02a9f024-4fc7-40e9-9fdd-a6f77df8bca6",
        "_rev": "8-75505a5a59164164b485117666f06444"
    }, {
        "db_seq": 2,
        "timestamp": 1583607902123,
        "db_name": "tables",
        "capacity": 1,
        "status": 1,
        "name": "AltBar-5",
        "description": null,
        "customers": [],
        "floor_id": "4f23cfaa-92db-4059-b269-fe901c24bf30",
        "position": {
            "x": 256,
            "y": 236,
            "height": 80,
            "width": 120
        },
        "_id": "05b97516-db3b-48f0-97a1-3e9ccc7ab6fd",
        "_rev": "5-5b3dd2b1c6ac46e5b36d8f4fc2faeb69"
    }, {
        "timestamp": 1596983317073,
        "db_seq": 2,
        "db_name": "tables",
        "capacity": 4,
        "status": 2,
        "name": "B8",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 930,
            "y": 55,
            "height": 85,
            "width": 180
        },
        "_id": "070c47bf-d130-4650-8930-0289e4c67bdd",
        "_rev": "46-ae4a907f0e224de3829a201db55f58d6"
    }, {
        "db_seq": 1,
        "timestamp": 1595701530451,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "M4",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 113,
            "y": 149,
            "height": 75,
            "width": 75
        },
        "_id": "0ba20c9e-943c-4e8e-aa2b-0bb7eec3c959",
        "_rev": "5-ff86c128e3c5418b975d454d9c54570e"
    }, {
        "db_seq": 1,
        "timestamp": 1596915658615,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "C-2",
        "description": null,
        "customers": [],
        "floor_id": "dbf4e6c9-124b-4f07-a86d-39709fbdfa1c",
        "position": {
            "x": 592,
            "y": 23,
            "height": 75,
            "width": 75
        },
        "_id": "0f53abee-e381-4a20-b294-d22bc11b7f78",
        "_rev": "34-674e11b3bfdd478b9d33956b7a99efd4"
    }, {
        "name": "HAKAN ÖZDEM",
        "floor_id": "94550610-dd8c-4929-b9e7-5cf67387331d",
        "capacity": 1,
        "description": null,
        "status": 1,
        "timestamp": 1595971080259,
        "customers": [],
        "db_name": "tables",
        "db_seq": 0,
        "position": {
            "x": 20,
            "y": 361,
            "height": 80,
            "width": 200
        },
        "_id": "14b6c235-c149-42cb-bc44-44f86d2c9aee",
        "_rev": "7-788817a75b2041fa9c642f7e6c5bebad"
    }, {
        "db_seq": 1,
        "timestamp": 1583863591497,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "B7.5",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 554,
            "y": 187,
            "height": 75,
            "width": 75
        },
        "_id": "150fabbb-389f-412b-aa31-e8fd7b9dfb73",
        "_rev": "12-38b4fcc02d774dfa8348f8587bed3242"
    }, {
        "db_seq": 1,
        "timestamp": 1596984750252,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "T2.5",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 109,
            "y": 406,
            "height": 75,
            "width": 75
        },
        "_id": "1d737275-5efc-430e-8e8d-f4b09c928c6e",
        "_rev": "7-ada8a32c80484386aaaa97f4b966c249"
    }, {
        "timestamp": 1596917344822,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "B7",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 632,
            "y": 187,
            "height": 75,
            "width": 75
        },
        "_id": "1f498c02-5644-4de3-82ac-044ecee6a906",
        "_rev": "43-15d9277e9c9643faa9ef8a0ccf7a9408"
    }, {
        "timestamp": 1596979004627,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 4,
        "status": 2,
        "name": "B1",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 149,
            "y": 234,
            "height": 80,
            "width": 170
        },
        "_id": "201e2522-54fb-445a-becc-c7f7e826f027",
        "_rev": "54-88d3546704b1ee24cc67cefcd77aaf66"
    }, {
        "db_seq": 1,
        "timestamp": 1596911859392,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "B11",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 955,
            "y": 492,
            "height": 80,
            "width": 160
        },
        "_id": "2def61b4-d2e6-4843-abdb-ab153c136555",
        "_rev": "26-0830b40ae6e24202a52cf4da41d91b17"
    }, {
        "db_seq": 1,
        "timestamp": 1591542088532,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "B5.5",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 356,
            "y": 384,
            "height": 75,
            "width": 75
        },
        "_id": "34bd8d2b-50ab-4c45-9092-6e6f1d4ceeae",
        "_rev": "10-d55920234f654134b0a3f8f07cbc7e9c"
    }, {
        "timestamp": 1596827608128,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 1,
        "status": 1,
        "name": "Personel",
        "description": null,
        "customers": [],
        "floor_id": "94550610-dd8c-4929-b9e7-5cf67387331d",
        "position": {
            "x": 21,
            "y": 17,
            "height": 200,
            "width": 200
        },
        "_id": "3aee9ce5-fc46-47b7-aae4-da0c0572d6b6",
        "_rev": "7-8776743d830f27b5866b49163508fc42"
    }, {
        "db_seq": 0,
        "timestamp": 1596921695974,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "C-1.5",
        "description": null,
        "customers": [],
        "floor_id": "dbf4e6c9-124b-4f07-a86d-39709fbdfa1c",
        "position": {
            "x": 937,
            "y": 21,
            "height": 75,
            "width": 75
        },
        "_id": "45a572bc-4eb6-4d84-8c5f-82e35fc6410b",
        "_rev": "11-43e531a5714043f2a3087f49d4eeabbf"
    }, {
        "db_seq": 1,
        "timestamp": 1596983790631,
        "db_name": "tables",
        "capacity": 6,
        "status": 1,
        "name": "A3",
        "description": null,
        "customers": [],
        "floor_id": "14bf877e-b956-4755-988e-17e1f58ad6d4",
        "position": {
            "x": 31,
            "y": 198,
            "height": 200,
            "width": 160
        },
        "_id": "471774a3-105d-4ad2-b50c-6a7bc600ec8b",
        "_rev": "10-55946d87738b940946ec7ab7dfc1e2b3"
    }, {
        "timestamp": 1583612175073,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "T3.5",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 108,
            "y": 525,
            "height": 75,
            "width": 75
        },
        "_id": "4a7bbfb9-074a-4898-8ce3-109c7f08841b",
        "_rev": "5-67978f605ed5470b94d1158e4b46ec7f"
    }, {
        "db_seq": 1,
        "timestamp": 1583608343412,
        "db_name": "tables",
        "capacity": 1,
        "status": 1,
        "name": "AltBar-6",
        "description": null,
        "customers": [],
        "floor_id": "4f23cfaa-92db-4059-b269-fe901c24bf30",
        "position": {
            "x": 255,
            "y": 129,
            "height": 80,
            "width": 120
        },
        "_id": "4d48aacd-d506-4cc7-b49c-a8d3b5c955dd",
        "_rev": "5-3314ab1267df422f96e4d565105c3f43"
    }, {
        "db_seq": 1,
        "timestamp": 1596906618387,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "T8",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 481,
            "y": 159,
            "height": 75,
            "width": 75
        },
        "_id": "5201f469-78b5-4daa-be0a-35343d78825a",
        "_rev": "17-082da7298fae4c669030ff8178ef97a3"
    }, {
        "db_seq": 1,
        "timestamp": 1596475275339,
        "db_name": "tables",
        "capacity": 1,
        "status": 1,
        "name": "AltBar-3",
        "description": null,
        "customers": [],
        "floor_id": "4f23cfaa-92db-4059-b269-fe901c24bf30",
        "position": {
            "x": 35,
            "y": 234,
            "height": 80,
            "width": 120
        },
        "_id": "52702fb5-71e6-45dc-bf5d-4f638b8d7ba4",
        "_rev": "6-4df0eadaf4484c30aa2996d9acdd0d4f"
    }, {
        "db_seq": 1,
        "timestamp": 1596919967356,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "T4",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 437,
            "y": 520,
            "height": 80,
            "width": 160
        },
        "_id": "535b7e2a-d183-4e02-bddf-6daf5bec6a9c",
        "_rev": "42-ce488a4f2e5b4935ac8bb039ab70a9a4"
    }, {
        "timestamp": 1596984832771,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "T1.5",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 112,
            "y": 291,
            "height": 75,
            "width": 75
        },
        "_id": "5c115a39-02d4-4696-92c6-d771c07e1f83",
        "_rev": "8-d2f4e590a9d243b3bcf78549a80fba24"
    }, {
        "timestamp": 1596981040523,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 4,
        "status": 2,
        "name": "B10",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 930,
            "y": 335,
            "height": 85,
            "width": 180
        },
        "_id": "6001723b-22c7-4fa5-9398-986253b847db",
        "_rev": "37-25d64c52d2d14e53877122c051f64dad"
    }, {
        "db_seq": 1,
        "timestamp": 1596917901274,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "B9",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 930,
            "y": 184,
            "height": 85,
            "width": 180
        },
        "_id": "603b143f-23c2-47a1-a035-78366d6c90ff",
        "_rev": "37-8a075b22cf9b4ec1af605937e22588f2"
    }, {
        "timestamp": 1596819502514,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "B5",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 438,
            "y": 381,
            "height": 80,
            "width": 160
        },
        "_id": "613facfd-1c0e-4a6c-9e47-37f38513dad7",
        "_rev": "12-c29a8bd887494f51bf6b198d4d8225c1"
    }, {
        "db_seq": 1,
        "timestamp": 1596913867123,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "B12",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 10,
            "y": 237,
            "height": 160,
            "width": 85
        },
        "_id": "630b8ce9-8291-44e7-b4b3-9584f39c5565",
        "_rev": "38-8b3c04fbc0e34a8f9ff78aecef135345"
    }, {
        "db_seq": 1,
        "timestamp": 1596917364354,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "T1",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 21,
            "y": 288,
            "height": 75,
            "width": 75
        },
        "_id": "636b8148-f960-4864-bdab-0e3448c8b721",
        "_rev": "29-4db148edf4214586a51055f6c62559ad"
    }, {
        "timestamp": 1596972417232,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 4,
        "status": 2,
        "name": "B13",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 11,
            "y": 420,
            "height": 160,
            "width": 85
        },
        "_id": "675c4637-d503-4d29-8df5-11f678b30f09",
        "_rev": "37-49bf8bb2713d41a9a218b4dbbd32fd9a"
    }, {
        "db_seq": 1,
        "timestamp": 1596833515419,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "B6",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 631,
            "y": 58,
            "height": 75,
            "width": 75
        },
        "_id": "6c0e6463-f294-4569-9801-a271df15d99f",
        "_rev": "34-719c3fbb889d46aca98eb2cc092fd224"
    }, {
        "db_seq": 1,
        "timestamp": 1595790300460,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "A2",
        "description": null,
        "customers": [],
        "floor_id": "14bf877e-b956-4755-988e-17e1f58ad6d4",
        "position": {
            "x": 26,
            "y": 48,
            "height": 80,
            "width": 160
        },
        "_id": "6f0601eb-1f6a-4fd1-adfa-d6b8cb0f7331",
        "_rev": "6-9d4e5ae31eda62e778ccff7ae3f1798e"
    }, {
        "timestamp": 1596912925218,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "T3",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 19,
            "y": 523,
            "height": 75,
            "width": 75
        },
        "_id": "71510fbf-a8f7-4b41-b381-11c8695d1a41",
        "_rev": "22-7b58314b2bbb479a9a440f044b0a734a"
    }, {
        "db_seq": 1,
        "timestamp": 1596820926105,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "B9.5",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 819,
            "y": 188,
            "height": 75,
            "width": 75
        },
        "_id": "722e0cd1-d0fe-49cc-ad14-f09698ab7e03",
        "_rev": "26-ff64018e409f42c2a1a14d3081fc644c"
    }, {
        "timestamp": 1596565052498,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "B8.5",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 820,
            "y": 56,
            "height": 75,
            "width": 75
        },
        "_id": "73e45e92-fe6f-4235-9f76-5e9dd11af16f",
        "_rev": "8-ae8b69cb70f74a23ba4a29f229997a2e"
    }, {
        "db_seq": 1,
        "timestamp": 1596829311330,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "C-4",
        "description": null,
        "customers": [],
        "floor_id": "dbf4e6c9-124b-4f07-a86d-39709fbdfa1c",
        "position": {
            "x": 1023,
            "y": 190,
            "height": 75,
            "width": 75
        },
        "_id": "7478413e-46d5-4f40-88d8-2148d11f4a09",
        "_rev": "18-043414eddab54adcbc3fcc4c21bbdd05"
    }, {
        "db_seq": 1,
        "timestamp": 1595773709032,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "B10.5",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 819,
            "y": 338,
            "height": 75,
            "width": 75
        },
        "_id": "7dfd21cc-8904-4672-ba9a-c66a524b8028",
        "_rev": "9-10b00464f48f41ea8e695d4ae363dde5"
    }, {
        "db_seq": 1,
        "timestamp": 1595622725221,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "Kapı",
        "description": null,
        "customers": [],
        "floor_id": "4f23cfaa-92db-4059-b269-fe901c24bf30",
        "position": {
            "x": 57,
            "y": 361,
            "height": 80,
            "width": 300
        },
        "_id": "7f4ed9db-ab7f-400b-9546-f9627af2150b",
        "_rev": "9-343eaaf6e7e149c9905b0548422e361a"
    }, {
        "timestamp": 1596983631080,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "C-3.5",
        "description": null,
        "customers": [],
        "floor_id": "dbf4e6c9-124b-4f07-a86d-39709fbdfa1c",
        "position": {
            "x": 682,
            "y": 194,
            "height": 75,
            "width": 75
        },
        "_id": "8baea79f-fbea-4353-8726-10ec5db89b76",
        "_rev": "7-43971d80f3d64a9590ef85d2c76f3621"
    }, {
        "timestamp": 1596916840958,
        "db_seq": 0,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "C-3",
        "description": null,
        "customers": [],
        "floor_id": "dbf4e6c9-124b-4f07-a86d-39709fbdfa1c",
        "position": {
            "x": 593,
            "y": 193,
            "height": 75,
            "width": 75
        },
        "_id": "8c05beb9-818e-4509-b35f-5260edca06a5",
        "_rev": "44-7c5b8a5c5e284de59b09cb9b8ecd0573"
    }, {
        "db_seq": 1,
        "timestamp": 1595971080259,
        "db_name": "tables",
        "capacity": 1,
        "status": 1,
        "name": "ÜstBar-3",
        "description": null,
        "customers": [],
        "floor_id": "2e5955ad-219b-4dcf-b0b1-ff5a00b9797e",
        "position": {
            "x": 44,
            "y": 509,
            "height": 80,
            "width": 160
        },
        "_id": "8d35e39f-3d67-4832-ac4f-3fc33129e0b4",
        "_rev": "8-d4a871e6f7294016b658c372c317edb9"
    }, {
        "db_seq": 1,
        "timestamp": 1596564568959,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "C-4.5",
        "description": null,
        "customers": [],
        "floor_id": "dbf4e6c9-124b-4f07-a86d-39709fbdfa1c",
        "position": {
            "x": 937,
            "y": 190,
            "height": 75,
            "width": 75
        },
        "_id": "8d6da10b-12be-4b21-8f61-02a1d692c34c",
        "_rev": "7-8f6fe746b3bd454694f4269904574fee"
    }, {
        "db_seq": 1,
        "timestamp": 1596919253192,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "M3",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 19,
            "y": 149,
            "height": 75,
            "width": 75
        },
        "_id": "9b342711-ebe3-4078-9db6-475029a1a4fd",
        "_rev": "23-759dc5e9f61a40978081e661afe0f9cc"
    }, {
        "db_seq": 1,
        "timestamp": 1594751318802,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "C-2.5",
        "description": null,
        "customers": [],
        "floor_id": "dbf4e6c9-124b-4f07-a86d-39709fbdfa1c",
        "position": {
            "x": 680,
            "y": 23,
            "height": 75,
            "width": 75
        },
        "_id": "9bdb6ca1-308e-4a2c-83b6-8c437696c756",
        "_rev": "5-de8aa8be4f7a4f31b8771ac7ba7855f0"
    }, {
        "db_seq": 1,
        "timestamp": 1596976567993,
        "db_name": "tables",
        "capacity": 2,
        "status": 2,
        "name": "C-1",
        "description": null,
        "customers": [],
        "floor_id": "dbf4e6c9-124b-4f07-a86d-39709fbdfa1c",
        "position": {
            "x": 1026,
            "y": 22,
            "height": 75,
            "width": 75
        },
        "_id": "9d9869f2-aa5e-470f-bc16-9c0c722b0f5b",
        "_rev": "58-020d5ad1878a4609ac2dbd1bb0b22619"
    }, {
        "db_seq": 1,
        "timestamp": 1596907696715,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "M2",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 242,
            "y": 14,
            "height": 80,
            "width": 160
        },
        "_id": "a1023366-881b-4622-8a94-d623333c0737",
        "_rev": "23-c44bf867859047dfa96ee41dc87ad9f4"
    }, {
        "timestamp": 1596922325710,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "T2",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 21,
            "y": 404,
            "height": 75,
            "width": 75
        },
        "_id": "a1956344-f813-4f74-8d9e-dcbc0adbdf64",
        "_rev": "37-97281ef65de348faafb5d87370391a5a"
    }, {
        "name": "ÇAĞATAY BAŞ",
        "floor_id": "94550610-dd8c-4929-b9e7-5cf67387331d",
        "capacity": 1,
        "description": null,
        "status": 1,
        "timestamp": 1596061245102,
        "customers": [],
        "db_name": "tables",
        "db_seq": 0,
        "position": {
            "x": 21,
            "y": 238,
            "height": 100,
            "width": 200
        },
        "_id": "a41a0a7f-4f24-4114-b65f-fc7a4c61276a",
        "_rev": "6-7ff2298dd4f5439aa6d9d3389d4bc0f2"
    }, {
        "db_seq": 1,
        "timestamp": 1595880362699,
        "db_name": "tables",
        "capacity": 1,
        "status": 1,
        "name": "ÜstBar-2",
        "description": null,
        "customers": [],
        "floor_id": "2e5955ad-219b-4dcf-b0b1-ff5a00b9797e",
        "position": {
            "x": 325,
            "y": 509,
            "height": 80,
            "width": 160
        },
        "_id": "affc2c95-191e-4bc3-9c22-661750462d7b",
        "_rev": "10-cf8432898943498dbcb471dafdcca67c"
    }, {
        "db_seq": 1,
        "timestamp": 1596826960531,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "T6",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 938,
            "y": 231,
            "height": 80,
            "width": 160
        },
        "_id": "b46adfa8-698b-4c5c-8950-c972d58962d0",
        "_rev": "20-37d8a910a68243858d5f45092afb339a"
    }, {
        "timestamp": 1596920512737,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "T7",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 421,
            "y": 294,
            "height": 80,
            "width": 200
        },
        "_id": "b9ad9e83-90e9-4538-bdc7-922aab8e0417",
        "_rev": "52-3d274209cd2b42a0b09c0df7938ffea1"
    }, {
        "timestamp": 1596921222346,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "M1",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 18,
            "y": 14,
            "height": 80,
            "width": 160
        },
        "_id": "b9c7343f-9942-44f8-b621-6b012dc1387d",
        "_rev": "32-720771cf1043513bbf11565944413348"
    }, {
        "db_seq": 0,
        "timestamp": 1596918158446,
        "db_name": "tables",
        "capacity": 1,
        "status": 1,
        "name": "DJ",
        "description": null,
        "customers": [],
        "floor_id": "94550610-dd8c-4929-b9e7-5cf67387331d",
        "position": {
            "x": 325,
            "y": 144,
            "height": 75,
            "width": 75
        },
        "_id": "c0b58937-792b-417e-a458-69cd6860412c",
        "_rev": "11-e4d0850052364c19b63a5226040212d8"
    }, {
        "db_seq": 1,
        "timestamp": 1596919824749,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "B2",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 182,
            "y": 367,
            "height": 75,
            "width": 75
        },
        "_id": "c45e5b02-9c41-4772-b8df-4c1be47ca696",
        "_rev": "20-8d7198c6f1eb4254a8db9f93ac31b3d3"
    }, {
        "timestamp": 1596831198664,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "T4.5",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 438,
            "y": 431,
            "height": 80,
            "width": 160
        },
        "_id": "cae5b5de-73f3-49c7-9742-c1f378575d44",
        "_rev": "13-a99533bac467435ba2ef55610c3c0abc"
    }, {
        "timestamp": 1596815381581,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 1,
        "status": 1,
        "name": "ÜstBar-1",
        "description": null,
        "customers": [],
        "floor_id": "2e5955ad-219b-4dcf-b0b1-ff5a00b9797e",
        "position": {
            "x": 571,
            "y": 507,
            "height": 80,
            "width": 160
        },
        "_id": "d018eae2-e87d-4f75-bfb2-ebbec2acbd5a",
        "_rev": "14-1241a43e79eb4c63aa0bf69be6420ee5"
    }, {
        "db_seq": 1,
        "timestamp": 1596903261863,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "A1",
        "description": null,
        "customers": [],
        "floor_id": "14bf877e-b956-4755-988e-17e1f58ad6d4",
        "position": {
            "x": 413,
            "y": 257,
            "height": 80,
            "width": 160
        },
        "_id": "d26de624-e40a-4d62-9b89-a3b89330f543",
        "_rev": "10-03821cdd9c20499393e1eb77d6a6272e"
    }, {
        "db_seq": 1,
        "timestamp": 1596925245963,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "T5",
        "description": null,
        "customers": [],
        "floor_id": "64b951c5-bd14-4c09-8b48-173c2625d143",
        "position": {
            "x": 940,
            "y": 512,
            "height": 80,
            "width": 160
        },
        "_id": "d3549f57-d67e-4805-814b-f87ab9688718",
        "_rev": "50-1ceaf1de4c674f1e9f0a10577169b472"
    }, {
        "db_seq": 1,
        "timestamp": 1591988493642,
        "db_name": "tables",
        "capacity": 2,
        "status": 1,
        "name": "B11.5",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 874,
            "y": 493,
            "height": 75,
            "width": 75
        },
        "_id": "d9c00521-8a84-4b35-8f16-9ea5ca9c2545",
        "_rev": "13-bb622b5ffcd046c985b2ad45d2630d18"
    }, {
        "timestamp": 1596806673972,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 1,
        "status": 1,
        "name": "Caner Düven",
        "description": null,
        "customers": [],
        "floor_id": "94550610-dd8c-4929-b9e7-5cf67387331d",
        "position": {
            "x": 270,
            "y": 22,
            "height": 100,
            "width": 200
        },
        "_id": "def4daf0-1bba-4f88-8877-3781f21955c5",
        "_rev": "23-9c3ba77be4cd4382bd8a062303426767"
    }, {
        "timestamp": 1584213703970,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 1,
        "status": 1,
        "name": "AltBar-4",
        "description": null,
        "customers": [],
        "floor_id": "4f23cfaa-92db-4059-b269-fe901c24bf30",
        "position": {
            "x": 256,
            "y": 20,
            "height": 80,
            "width": 120
        },
        "_id": "e543bd7b-c543-4b01-a243-1fd538219f30",
        "_rev": "6-24d0b7a19e65405880daa540c183dcc8"
    }, {
        "timestamp": 1596917901274,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 4,
        "status": 1,
        "name": "B4",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 334,
            "y": 233,
            "height": 80,
            "width": 170
        },
        "_id": "e9153bfb-68e2-4474-906b-44589be7b5dc",
        "_rev": "40-9dba6cda1ad747548e93bc5e52be50a0"
    }, {
        "timestamp": 1596970013815,
        "db_seq": 1,
        "db_name": "tables",
        "capacity": 1,
        "status": 1,
        "name": "AltBar-1",
        "description": null,
        "customers": [],
        "floor_id": "4f23cfaa-92db-4059-b269-fe901c24bf30",
        "position": {
            "x": 28,
            "y": 20,
            "height": 80,
            "width": 120
        },
        "_id": "f45961e6-c849-4994-852e-0f6a96a87405",
        "_rev": "26-6e8a912b78a14df39b8e8b521bc0f99f"
    }, {
        "timestamp": 1596980409637,
        "db_seq": 0,
        "db_name": "tables",
        "capacity": 2,
        "status": 2,
        "name": "B3",
        "description": null,
        "customers": [],
        "floor_id": "e3948445-8b12-45d9-95d5-22471dade1a7",
        "position": {
            "x": 283,
            "y": 486,
            "height": 120,
            "width": 90
        },
        "_id": "f726132e-6043-4b65-9b14-ebf6bc6f4806",
        "_rev": "58-8c527a8b0ab34410bc7b3d5b2b73b75f"
    }];




    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];

        tables.map(obj => {
            delete obj._rev;
            return obj;
        })
        RemoteDB(db, 'kosmos-besiktas').bulkDocs(tables).then(res => {
            console.log('Property Added Successfuly');
        })

        // RemoteDB(db, 'kosmos-besiktas').find({ selector: { db_name: 'tables' }, limit: 2500 }).then((res: any) => {
        //     console.log(res.docs.length, tables.length);
        //     return res.docs.map(object => {
        //         try {
        //             let position = tables.find(obj => obj.name == object.name).position;
        //             object.position = position;
        //         } catch (error) {
        //             console.log(object.name);
        //         }
        //         console.log(object.name, object.position);
        //         return object;
        //     });
        // }).then(stocks => {
        //     console.log(stocks);
        //     RemoteDB(db, 'kosmos-besiktas').bulkDocs(stocks).then(res => {
        //         console.log('Property Added Successfuly');
        //     })
        // })
    })

}

export const kent = () => {

    // ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
    //     let db: Database = res.docs[0];
    //     RemoteDB(db, 'quickly-cafe-130c').find({ selector: { db_name: 'tables' }, limit: 2500 }).then((res: any) => {
    //         let pTables = res.docs;
    //         // console.log(pTables);
    //         RemoteDB(db, 'kent-besiktas-8e12').find({ selector: { db_name: 'tables' }, limit: 2500 }).then((sres: any) => {
    //             let lTables = sres.docs;
    //             lTables.forEach(obj => {
    //                 try {
    //                     let pTable = pTables.find(element => element.name == obj.name).position;
    //                     obj.position = pTable;
    //                 } catch (error) {

    //                 }

    //             });

    //             return lTables;

    //         }).then(tables => {
    //             console.log(tables);
    //             RemoteDB(db, 'kent-besiktas-8e12').bulkDocs(tables).then(res => {
    //                 console.log('Property Added Successfuly');
    //             }).catch(err => {
    //                 console.log(err);
    //             })
    //         }).catch(err => {
    //             console.log(err);
    //         })

    //     });
    // })

    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];


        RemoteDB(db, 'kent-besiktas-8e12').find({ selector: { db_name: 'closed_checks', payment_method: 'Parçalı' }, limit: 2500 }).then((res: any) => {
            return res.docs.map(object => {
                object.payment_flow.forEach(obj => {
                    obj.method = 'Nakit';
                });
                return object;
            });
        }).then(stocks => {
            RemoteDB(db, 'kent-besiktas-8e12').bulkDocs(stocks).then(res => {
                console.log('Property Added Successfuly');
            }).catch(err => {
                console.log(err);
            })
        })


        RemoteDB(db, 'kent-besiktas-8e12').find({ selector: { db_name: 'closed_checks', payment_method: 'Kart' }, limit: 2500 }).then((res: any) => {
            return res.docs.map(object => {
                object.payment_method = 'Nakit';
                return object;
            });
        }).then(stocks => {
            if (stocks.length > 0) {
                RemoteDB(db, 'kent-besiktas-8e12').bulkDocs(stocks).then(res => {
                    console.log('Method Changed');
                }).catch(err => {
                    console.log(err);
                })
            }
        });
    })

}

export const importProducts = () => {

    // {
    //     sku -> sku
    //     name -> ürün adı
    //     category -> alt kategori
    //     brand -> ürün markası
    //     price -> ürün fiyatı
    //     currency -> ürün kuru
    //     image -> ürün fotoğrafı (base64)
    // }

    // name: string;
    // description: string;
    // category: string;
    // sub_category: string;
    // unit: string;
    // portion: number;
    // producer_id: string;
    // tax_value: number;
    // image: string;
    // ingredients: Array<any>;
    // tags: Array<any>;
    // calorie: number;
    // barcode: number;
    // timestamp: number;

    let filesPath = path.join(__dirname, '../..', '/products/alcohols.json');
    readJsonFile(filesPath).then((res: Array<any>) => {
        let products = [];
        res.forEach(res => {
            let mutated = {
                name: res.name,
                description: res.brand + ' ' + res.name + ' ' + res.category,
                category: 0,
                sub_category: res.category,
                unit: 'Mililitre',
                portion: 100,
                producer_id: res.brand,
                tax_value: 8,
                image: 'data:image/jpeg;base64,' + encodeURI(res.image),
                ingredients: [],
                tags: res.name.split(' '),
                calorie: 0,
                barcode: 0,
                status: 0,
                timestamp: Date.now()
            };
            products.push(mutated);
        })
        ManagementDB.Products.bulkDocs(products).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })

}


export const importDatabase = () => {
    let databasePath = path.join(__dirname, '../..', '/backup/goches/db.json');
    readJsonFile(databasePath).then((res: Array<any>) => {

        let products = res;

        products = products.filter(({ db_name, type }) => db_name == 'floors');
        products.map(obj => obj.printer = 'Kasa');

        ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
            let db: Database = res.docs[0];

            console.log(products.length);
            // CouchDB(db).request({
            //     db: 'goches-coffee-18fa',
            //     path: '_purge',
            //     method: 'post',
            //     body: {
            //         'mydocid': ['rev-one', 'rev-two']
            //     }
            // })
            CouchDB(db).db.use('goches-coffee-18fa')
                .compact().then(res => {
                    console.log(res);
                })
            // .info().then(res => {
            //     console.info(res);
            // })
            // RemoteDB(db, 'goches-coffee-18fa').bulkDocs(products).then(res => {
            //     console.log('Documents İmported Successfuly');
            // }).catch(err => {
            //     console.log(err);
            // })

        }).catch(err => {
            console.log(err);
        });
    });
}


export const createProductIndexes = () => {
    console.log('Indexing Started For Products Database');
    createIndexesForDatabase(ManagementDB.Products, { index: { fields: ['producer_id', 'brand_id'] } }).then(res => {
        console.log(res);
        console.log('Indexing Finished Succesfully For Products Database');
    }).catch(err => {
        console.log('Indexing Throw Error For Products Database');
        console.error(err);
    })
}


export const ReportsClearer = async (db_name) => {
    try {
        const db = await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } });
        const reports = await RemoteDB(db.docs[0], db_name).find({ selector: { db_name: 'reports', type: 'Product' }, limit: 2500 });
        let reportsWillUpdate = reports.docs;
        reportsWillUpdate.map((report: any) => {
            try {
                let days = [0, 1, 2, 3, 4, 5, 6];
                days.forEach(element => {
                    report.weekly_count[element] = 0;
                    report.weekly[element] = 0;
                    console.log(element);
                });
            } catch (error) {
                // RemoteDB(db.docs[0], db_name).remove(report).then(res => {
                //     console.log('UNUSED REPORT DELETED', report)
                // }).catch(err => {
                //     console.log('Remote Connection Error');
                // })
            }
        });
        RemoteDB(db.docs[0], db_name).bulkDocs(reportsWillUpdate).then(response => {
            console.log(response);
        }).catch(err => {
            console.log(err);
        })
    } catch (error) {
        console.error(error);
    }

}

export const productFinder = (product_name: string) => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        let remote = RemoteDB(db, 'kosmos-db15');

        remote.find({ selector: { db_name: 'products' }, limit: 2500 }).then((res: any) => {

            let products: Array<CheckProduct> = res.docs;

            let regex = new RegExp(product_name, 'i');

            let results = products.filter(obj => obj.name.match(regex));

            console.log(results);
        });
    });
}



export const invoiceReader = () => {
    const xmlParser = new Parser();
    const invoicePath = path.join(__dirname, '../', '/backup/kosmos/fatura.xml');
    readFile(invoicePath, (err, buffer) => {
        if (!err) {
            let data = buffer.toString('utf8');
            xmlParser.parseStringPromise(data).then(res => {

                res['Invoice']['cac:InvoiceLine'].forEach(row => {


                    let quantity = row["cbc:InvoicedQuantity"][0]["_"];
                    let total_price = row["cbc:LineExtensionAmount"][0]["_"];
                    let currency = row["cbc:LineExtensionAmount"][0]["$"];
                    let discountAmount = row["cac:AllowanceCharge"][0]["cbc:Amount"][0]["_"];
                    let discountValue = row["cac:AllowanceCharge"][0]["cbc:MultiplierFactorNumeric"];
                    let withoutDiscount = row["cac:AllowanceCharge"][0]["cbc:BaseAmount"][0]["_"];
                    let taxAmount = row["cac:TaxTotal"][0]["cbc:TaxAmount"][0]["_"];
                    let taxPercent = row["cac:TaxTotal"][0]["cbc:Percent"];
                    let itemName = row["cac:Item"][0]["cbc:Description"];
                    let itemId = row["cac:Item"][0]["cbc:Name"];
                    let itemPrice = row["cac:Price"][0]["cbc:PriceAmount"][0]["_"];

                    console.log(quantity + ' Adet     ' + itemName + ' | ' + total_price);
                });

                // writeJsonFile(__dirname + '/test.json', invoiceJson).then(res => {
                //     console.log(res);
                // }).catch(err => {
                //     console.log(err);
                // })

            }).catch(err => {
                console.log(err);
            })
        } else {
            console.log(err);
        }
    });
}

// export const productToStockApi = async (product_id: string, quantity: number, store_id: string) => {
//     try {
//         const product = await ManagementDB.Products.get(product_id);
//         const StoresDB = await StoreDB(store_id);
//         const isAlreadyAdded = await StoresDB.find({ selector: { db_name: 'stocks', product: product_id } });
//         if (isAlreadyAdded.docs.length > 0) {
//             throw Error('Stock Already Added');
//         } else {
//             return StoresDB.post({ db_name: 'stocks', ...productToStock(product, quantity) });
//         }
//     } catch (error) {
//         throw Error(error);
//     }
// }

export const documentbackup = (from: string, to: string, selector: any) => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        RemoteDB(db, from).find({ selector: selector, limit: 2500 }).then((res: any) => {
            return res.docs.map(obj => {
                delete obj._rev;
                return obj;
            });
        }).then(documents => {
            writeJsonFile(documentsPath, 'harbi.json').then(res => {
                console.log(res);
            })
        })
    })
}


export const lastChanges = () => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        CouchDB(db).db.list().then((db_list: Array<string>) => {
            db_list = db_list.filter(obj => obj.charAt(0) !== '_');
            db_list.forEach(db_name => {
                RemoteDB(db, db_name).get('lastseen').then(res => {
                    console.log(res);
                }).catch(err => {

                })
            });
        }).catch(err => {
            console.log('TEST');
        });
    })
};


export const reisImport = () => {



    readJsonFile(reisPath + 'product.json').then((res: Array<any>) => {

        // let products = res;

        // products.map(obj => {

        //     delete obj.id;
        //     delete obj.rev;
        //     obj.specifies = [];
        //     obj.description = '';
        //     obj.status = 1;
        //     obj.price = parseFloat(obj.price);
        //     obj.tax_value = parseInt(obj.tax_value);
        //     obj.db_name = "products";
        //     obj.db_seq = 0;

        //     return obj;
        // })


        // ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        //     let db: Database = res.docs[0];
        //     RemoteDB(db, 'reis-doner-bagcilar-parseller').bulkDocs(products).then(res => {
        //         console.log('Ürünler Yüklendi');
        //     }).catch(err => {
        //         console.log(err);
        //     })
        // }).catch(err => {
        //     console.log(err);
        // })


        // {
        //     "_id": "01c17ab9-98e2-44fd-b995-626aeba62d9c",
        //     "_rev": "1-a7fa337b3e313cd0d3487bd52240e563",
        //     "cat_id": "9592dcb5-cc05-425b-9720-071d20312c63",
        //     "db_seq": 0,
        //     "subcat_id": "ec2322e4-71bc-43c2-844a-9acf479ac823",
        //     "status": 1,
        //     "barcode": null,
        //     "db_name": "products",
        //     "type": "1",
        //     "price": 25,
        //     "name": "Bulleit Rye 3cl.",
        //     "description": null,
        //     "tax_value": 18,
        //     "specifies": []
        //   }

        // let customers = res;

        // customers.map(obj => {
        //     delete obj['id?'];
        //     delete obj['rev?'];
        //     obj.phone_number = parseInt(obj.phone_number)
        //     obj.timestamp = Date.now();
        //     obj.type = "1";
        //     obj.db_name = 'customers';
        //     obj.db_seq = 0;
        //     return obj;
        // })

        // ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        //     let db: Database = res.docs[0];
        //     RemoteDB(db, 'reis-doner-bagcilar-parseller').bulkDocs(customers).then(res => {
        //         console.log('Müşterileri Yüklendi');
        //     }).catch(err => {
        //         console.log(err);
        //     })
        // }).catch(err => {
        //     console.log(err);
        // })


    })



}