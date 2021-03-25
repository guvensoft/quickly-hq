import path from 'path';
import { writeFile, readFile, readFileSync } from 'fs';
import { CouchDB, ManagementDB, RemoteDB, StoresDB, StoreDB, DatabaseQueryLimit, RemoteCollection } from './configrations/database';
import { Database } from './models/management/database';
import { Store } from './models/management/store';
import { Stock } from './models/store/stocks';
import { backupPath, documentsPath, reisPath } from './configrations/paths';
import { BackupData, EndDay } from './models/store/endoftheday';
import { Report, createReport } from './models/store/report';
import { Cashbox } from './models/store/cashbox';
import { ClosedCheck, CheckProduct, Check, CheckType } from './models/store/check';
import { Log, logType } from './models/store/log';
import { readJsonFile, writeJsonFile, readDirectory } from './functions/files';
import { createIndexesForDatabase, purgeDatabase, createStoreDatabase } from './functions/database';

import { Parser } from 'xml2js';
import { Table, TableStatus } from './models/store/table';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Menu, MenuStatus } from './models/store/menu';
import { Category, Product, ProductSpecs, SubCategory } from './models/store/product';
import { productToStock } from './functions/stocks';
import { endDayProcess } from './controllers/store/endofday';

import { StoreReport, ProductsReport, UsersReport, UserProductSalesReport, TablesReport, StoreSalesReport } from './functions/store/reports';

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
                    console.log(selectedDatabase);
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

                    // oldChecks.forEach((check, index) => {
                    //     RemoteDB(db, db_name).remove(check).then(res => {
                    //         console.log(check._id, 'Silindi');
                    //     });
                    // })


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

export const dayDetail = (store_id: string, day_file: string) => {

    readJsonFile(backupPath + store_id + '/days/' + day_file).then((data: Array<BackupData>) => {

        const reports: Array<Report> = data.find(obj => obj.database == 'reports').docs;
        const checks: Array<ClosedCheck> = data.find(obj => obj.database == 'closed_checks').docs;
        const cashbox: Array<Cashbox> = data.find(obj => obj.database == 'cashbox').docs;
        const logs: Array<Log> = data.find(obj => obj.database == 'logs').docs;


        let cash = checks.filter(obj => obj.payment_method == 'Nakit' && obj.type !== CheckType.CANCELED).map(obj => obj.total_price).reduce((a, b) => a + b, 0);
        let card = checks.filter(obj => obj.payment_method == 'Kart' && obj.type !== CheckType.CANCELED).map(obj => obj.total_price).reduce((a, b) => a + b, 0);
        let coupon = checks.filter(obj => obj.payment_method == 'Kupon' && obj.type !== CheckType.CANCELED).map(obj => obj.total_price).reduce((a, b) => a + b, 0);
        let free = checks.filter(obj => obj.payment_method == 'İkram' && obj.type !== CheckType.CANCELED).map(obj => obj.total_price).reduce((a, b) => a + b, 0);
        let canceled = checks.filter(obj => obj.payment_method == 'İkram' && obj.type == CheckType.CANCELED).map(obj => obj.total_price).reduce((a, b) => a + b, 0);

        let partial = checks.filter(obj => obj.payment_method == 'Parçalı' && obj.type !== CheckType.CANCELED);

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

        let outcome = cashbox.map(obj => obj.cash).reduce((a, b) => a + b, 0);
        let discount = checks.map(obj => obj.discount).reduce((a, b) => a + b, 0);


        console.log('Nakit:', Math.floor(cash), 'TL');
        console.log('Kart:', Math.floor(card), 'TL');
        console.log('Kupon:', Math.floor(coupon), 'TL');
        console.log('İkram:', Math.floor(free), 'TL');
        console.log('İptal:', Math.floor(canceled), 'TL');
        console.log('İndirim:', Math.floor(discount), 'TL');
        console.log('Gider:', Math.floor(outcome), 'TL');
        console.log('Toplam', Math.floor(cash + card + coupon), 'TL');

        // logs = logs.sort((a, b) => a.timestamp - b.timestamp).filter(obj => obj.type === 7);

        // logs.forEach(log => {
        //     console.log('                ');
        //     console.log('----------------------------------------------------------------------');
        //     console.log(new Date(log.timestamp).toLocaleTimeString('tr'))
        //     console.log('Tür', log.type);
        //     console.log(log.user);
        //     console.log(log.description);
        //     console.log('----------------------------------------------------------------------');
        // })


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

    });
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // }).catch(err => {
    //     console.log(err);
    // })
}

export const allRevisions = (db_name: string, doc_id: string) => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        RemoteDB(db, db_name).get(doc_id, { revs_info: true }).then(res => {
            console.log(res);
            res._revs_info.filter(rev => rev.status == "available").forEach(obj => {
                RemoteDB(db, db_name).get(doc_id, { rev: obj.rev }).then((res: any) => {
                    console.log(res);
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
            RemoteDB(db, to).find({ selector: selector, limit: 5000 }).then(res => {
                let docs = res.docs;
                RemoteDB(db, from).find({ selector: selector, limit: 5000 }).then((res2: any) => {
                    return res2.docs.map(obj => {
                        let originalDoc = docs.find(doc => doc._id == obj._id);
                        if (originalDoc) {
                            obj._rev = originalDoc._rev;
                        }
                        return obj;
                    });
                }).then(documents => {
                    RemoteDB(db, to).bulkDocs(documents, {}).then(res3 => {
                        console.log('Document Moved Successfuly');
                    }).catch(err => {
                        console.log(err);
                    })
                })

            })
        } else if (type == 'fetch') {
            RemoteDB(db, from).find({ selector: selector, limit: 5000 }).then((res: any) => {
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

export const MoveData = (from: string, to: string, selector?: any) => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        RemoteDB(db, from).find({ selector: selector, limit: 2500 }).then((res: any) => {
            return res.docs.map(obj => {
                delete obj._rev;
                return obj;
            });
        }).then(documents => {
            RemoteDB(db, to).bulkDocs(documents).then(res => {
                console.log('Document Moved Successfuly');
            })
        })
    })
}

export const addProperty = () => {
    let position = { height: 75, width: 75, x: 100, y: 100, type: 0 };

    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];

        // tables.map(obj => {
        //     delete obj._rev;
        //     return obj;
        // })
        // RemoteDB(db, 'kosmos-besiktas').bulkDocs(tables).then(res => {
        //     console.log('Property Added Successfuly');
        // })

        RemoteDB(db, 'kosmos-besiktas').find({ selector: { db_name: 'tables' }, limit: 2500 }).then((res: any) => {
            return res.docs.map(object => {
                try {
                    object.position = position;
                } catch (error) {
                    console.log(object.name);
                }
                console.log(object.name, object.position);
                return object;
            });
        }).then(stocks => {
            console.log(stocks);
            RemoteDB(db, 'kosmos-besiktas').bulkDocs(stocks).then(res => {
                console.log('Property Added Successfuly');
            })
        })
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

export const productToStockApi = async (product_id: string, quantity: number, store_id: string) => {
    try {
        const product = await ManagementDB.Products.get(product_id);
        const StoresDB = await StoreDB(store_id);
        const isAlreadyAdded = await StoresDB.find({ selector: { db_name: 'stocks', product: product_id } });
        if (isAlreadyAdded.docs.length > 0) {
            throw Error('Stock Already Added');
        } else {
            return StoresDB.post({ db_name: 'stocks', ...productToStock(product, quantity) });
        }
    } catch (error) {
        throw Error(error);
    }
}

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

export const importFromBackup = async (store_id: string) => {
    // let Store = await ManagementDB.Stores.get(store_id);
    let backupFile: Array<BackupData> = await readJsonFile(backupPath + `${store_id}/db.dat`);
    let bulkResponse = await (await StoreDB(store_id)).bulkDocs(backupFile);
    console.log(bulkResponse);
};

export const clearDatabase = async (store_id: string) => {
    try {
        const Store: Store = await ManagementDB.Stores.get(store_id);
        const StoreDocuments = (await (await StoreDB(store_id)).allDocs({ include_docs: true })).rows.map(obj => obj.doc);
        const purgeProcess = await purgeDatabase(Store.auth);
        await (await StoreDB(store_id)).bulkDocs(StoreDocuments, {});
    } catch (error) {
        console.log(error);
    }
}

export const purgeTest = (store_id: string) => {
    ManagementDB.Stores.get(store_id).then(store => {
        purgeDatabase(store.auth).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    })
}

export const recrateDatabase = (store_id: string) => {
    ManagementDB.Stores.get(store_id).then(store => {
        createStoreDatabase(store.auth).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    });
}

export const addNotes = () => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        RemoteDB(db, 'kallavi-besiktas').find({ selector: { db_name: 'products' }, limit: 2500 }).then((res: any) => {
            return res.docs.map(object => {
                try {
                    object.notes = 'Tam Yağlı,Yarım Yağlı,Laktozsuz,Sade,Az Şekerli,Orta Şekerli,Şekerli,Bol Şekerli,Limon Dilimli,Buzlu,Tuzsuz,Sütlü';
                } catch (error) {
                    console.log(object.name);
                }
                // console.log(object.name, object.position);
                return object;
            });
        }).then(stocks => {
            console.log(stocks);
            RemoteDB(db, 'kallavi-besiktas').bulkDocs(stocks).then(res => {
                console.log('Property Added Successfuly');
            })
        })
    })
}

export const makePdf = async (db_name: string) => {
    try {
        const db = await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } });
        const enddays: Array<EndDay> = await (await RemoteDB(db.docs[0], db_name).find({ selector: { db_name: 'endday' }, limit: 2500 })).docs;
        const doc = new jsPDF({ orientation: "portrait" }); // landscape
        let bodyLink = [];
        const transformPrice = (value: number): string => {
            if (!value) value = 0;
            return Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' TL'; /// ₺
        }
        enddays.sort((a, b) => a.timestamp - b.timestamp).forEach((end, index) => {
            let data = [new Date(end.timestamp).toLocaleDateString('tr-TR'), transformPrice(end.total_income), transformPrice(end.cash_total), transformPrice(end.card_total), transformPrice(end.coupon_total), transformPrice(end.free_total), transformPrice(end.canceled_total), transformPrice(end.discount_total)];
            bodyLink.push(data);
        });
        autoTable(doc, {
            styles: {
                // cellPadding: 5,
                // fontSize: 10,
                font: "helvetica", // helvetica, times, courier
                lineColor: 200,
                // lineWidth: 0.1,
                fontStyle: 'bold', // normal, bold, italic, bolditalic
                overflow: 'ellipsize', // visible, hidden, ellipsize or linebreak
                // fillColor: 255,
                // textColor: 20,
                halign: 'right', // left, center, right
                valign: 'middle', // top, middle, bottom
                // fillStyle: 'F', // 'S', 'F' or 'DF' (stroke, fill or fill then stroke)
                // rowHeight: 20,
                // columnWidth: 'auto' // 'auto', 'wrap' or a number
            },
            head: [['Tarih', 'Toplam', 'Nakit', 'Kart', 'Kupon', 'Ikram', 'Iptal', 'Indirim']],
            body: bodyLink,
            theme: 'plain',
            headStyles: { halign: "center", fillColor: [43, 62, 80], textColor: 255 },
            columnStyles: {
                0: { fillColor: [43, 62, 80], textColor: 255, fontStyle: 'bold' },
                1: { fillColor: [28, 40, 48], textColor: 255, fontStyle: 'bold' },
                2: { fillColor: [28, 40, 48], textColor: [98, 173, 101], fontStyle: 'bold' },
                3: { fillColor: [28, 40, 48], textColor: [232, 167, 84], fontStyle: 'bold' },
                4: { fillColor: [28, 40, 48], textColor: [87, 184, 205], fontStyle: 'bold' },
                5: { fillColor: [28, 40, 48], textColor: [181, 91, 82], fontStyle: 'bold' },
                6: { fillColor: [28, 40, 48], textColor: [186, 109, 46], fontStyle: 'bold' },
                7: { fillColor: [28, 40, 48], textColor: 255, fontStyle: 'bold' },
            },
        })
        doc.save('table.pdf');
    } catch (err) {
        console.log(err);
    }
}

export const menuChanger = () => {
    ManagementDB.Databases.find({ selector: {} }).then(dbs => {
        let CouchRadore: Database = dbs.docs[0];

        RemoteDB(CouchRadore, 'quickly-menu-app').find({ selector: {} }).then(menus => {
            menus.docs.forEach(menu => {
                delete menu._id;
                delete menu._rev;
                delete menu.documentType;
                delete menu.advertising;
                delete menu.cigaretteSelling;
                delete menu.brandColor;


                let newMenu: Menu = {
                    slug: menu.slug,
                    categories: menu.categories,
                    promotions: menu.promotions,
                    social_links: menu.socialLinks.map(obj => {
                        obj.name = obj.displayName;
                        delete obj.displayName;
                        return obj;
                    }),
                    status: MenuStatus.ACTIVE,
                    store_id: menu.store_id,
                    theme: { background: 'dark', brand: '', buttons: 'primary', fonts: '', greetings: 'success', segment: 'dark' },
                }
                console.log(newMenu);
            })
        })
    })


}

export const menuToTerminal = async (store_id: string) => {
    try {
        const Database = await (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
        const StoreDatabase = await StoreDB(store_id);
        const Menu: Menu = await (await RemoteDB(Database, 'quickly-menu-app').find({ selector: { store_id: store_id } })).docs[0];

        Menu.categories.forEach((category, index) => {

            let newCategory: Category = { name: category.name, description: '', status: 0, order: index, tags: '', printer: 'Bar' }
            StoreDatabase.post({ db_name: 'categories', ...newCategory }).then(cat_res => {
                console.log('+ Kategori Eklendi', newCategory.name);
                if (category.items_group) {

                    category.items_group.forEach(sub_cat => {
                        let newSubCategory: SubCategory = { name: sub_cat.name, description: '', status: 0, cat_id: cat_res.id }
                        StoreDatabase.post({ db_name: 'sub_categories', ...newSubCategory }).then(sub_cat_res => {


                        }).catch(err => {


                        });
                    });
                } else {
                    category.items.forEach(item => {
                        if (item.price) {
                            let newProduct: Product = { name: item.name, description: item.description, type: 0, status: 0, price: item.price, barcode: 0, notes: null, specifies: [], cat_id: cat_res.id, tax_value: 8, }
                            StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                console.log('+ Ürün Eklendi', newCategory.name);
                                newProduct._id = product_res.id;
                                newProduct._rev = product_res.rev;
                                let newReport = createReport('Product', newProduct);
                                StoreDatabase.post(newReport).then(res => {
                                    console.log('+ Rapor Eklendi', newReport.description);
                                }).catch(err => {
                                    console.log('Rapor Hatası', newReport.description)
                                })
                            }).catch(err => {
                                console.log('Ürün Hatası', item.name)
                            })
                        } else {
                            let specs: Array<ProductSpecs> = [];
                            item.options.forEach(opts => {
                                let spec: ProductSpecs = {
                                    spec_name: opts.name,
                                    spec_price: opts.price
                                }
                                specs.push(spec);
                            })
                            let newProduct: Product = { name: item.name, description: item.description, type: 0, status: 0, price: specs[0].spec_price, barcode: 0, notes: null, specifies: specs, cat_id: cat_res.id, tax_value: 8, }
                            StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                console.log('+ Ürün Eklendi', newCategory.name);
                                newProduct._id = product_res.id;
                                newProduct._rev = product_res.rev;
                                let newReport = createReport('Product', newProduct);
                                StoreDatabase.post(newReport).then(res => {
                                    console.log('+ Rapor Eklendi', newReport.description);
                                }).catch(err => {
                                    console.log('Rapor Hatası', newReport.description)
                                })
                            }).catch(err => {
                                console.log('Ürün Hatası', item.name)
                            })
                        }
                    })
                }
            }).catch(err => {
                console.log('Kategori Hatası', category.name)
            })
        })
    } catch (error) {
        console.log(error);
    }

}

export const storesInfo2 = async () => {
    const OwnerID: string = 'bbe63bd6-b3bd-4011-ad7e-88180d3d0b0f' // req.app.locals.user;
    const OwnerStores = await (await ManagementDB.Owners.get(OwnerID)).stores;
    const Stores = await (await ManagementDB.Stores.allDocs({ include_docs: true, keys: OwnerStores })).rows.map(obj => obj.doc);




    // ManagementDB.Stores.bulkGet({})


    // ManagementDB.Stores.find({ selector: {}, limit: DatabaseQueryLimit, skip: 0 }).then((db_res: any) => {
    //     const Stores: Array<Store> = db_res.docs;
    //     ManagementDB.Owners.get(OwnerID).then(Owner => {
    //         let Response: Array<StoreInfo> = [];

    //         let OwnerStores = Stores.filter(store => Owner.stores.includes(store._id));

    //         OwnerStores.forEach((store, index) => {

    //             StoreDB(store._id).then(StoreDatabase => {

    //                 StoreDatabase.



    //             })



    //         })
    //     })
    // })

}


export const reportsTest = async (store_id: string) => {
    // const t0 = performance.now();

    const Days: Array<EndDay> = (await (await StoreDB(store_id)).find({ selector: { db_name: 'endday' } })).docs.sort((a, b) => a.timestamp - b.timestamp);
    const BackupData: Array<BackupData> = await StoreReport(store_id, Days[0].timestamp.toString(), Days[Days.length - 1].timestamp.toString());
    const Checks: Array<ClosedCheck> = BackupData.find(backup => backup.database == 'closed_checks').docs;
    const Sales = StoreSalesReport(Checks);
    console.log(Sales);

    // const t1 = performance.now();
    // console.log(`Call took ${t1 - t0} milliseconds.`);
}