import path from 'path';
import { writeFile, readFile, readFileSync } from 'fs';
import { CouchDB, ManagementDB, RemoteDB, StoresDB, StoreDB, DatabaseQueryLimit, RemoteCollection } from './configrations/database';
import { Database } from './models/management/database';
import { Store } from './models/management/store';
import { Stock } from './models/store/stocks';
import { backupPath, documentsPath } from './configrations/paths';
import { BackupData, EndDay } from './models/store/endoftheday';
import { Report, reportType } from './models/store/report';
import { Cashbox } from './models/store/cashbox';
import { ClosedCheck, CheckProduct, Check, CheckType } from './models/store/check';
import { Log, logType } from './models/store/log';
import { readJsonFile, writeJsonFile, readDirectory } from './functions/shared/files';
import { createIndexesForDatabase, purgeDatabase, createStoreDatabase } from './functions/management/database';
import { parse } from 'node-html-parser';

import fetch from 'node-fetch';

import { OptionsV2, Parser, processors } from 'xml2js';
import XLSX from 'xlsx';
import { Table, TableStatus } from './models/store/table';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { Menu, MenuStatus, Order } from './models/store/menu';
import { Category, Product, ProductSpecs, SubCategory } from './models/store/product';
import { productToStock } from './functions/store/stocks';
import { endDayProcess } from './controllers/store/endofday';

import { StoreReport, ProductsReport, UsersReport, UserProductSalesReport, TablesReport, StoreSalesReport, createReport } from './functions/store/reports';
import { getSession } from './controllers/management/session';

import fatura from 'fatura';
import { eFaturaSecret, eFaturaUserName } from './configrations/secrets';
import { Customer } from './models/store/customer';
import { proformaGenerator } from './functions/management/invoice';
import { parseBooleans, parseNumbers } from 'xml2js/lib/processors';
import axios from 'axios';
import { UBL } from './models/external/ubl';
import { performance } from 'perf_hooks';

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

    RemoteDB(db, db_name).bulkDocs(tables).then(res => {
        console.log('Tables Successfuly Reoladed...!');
    }).catch(err => {
        console.log(err);
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

export const Fixer = (db_name: string) => {

    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res) => {
        let db = res.docs[0];

        RemoteDB(db, db_name).find({ selector: { db_name: 'endday' }, limit: 2500 }).then((res: any) => {
            let lastDay: EndDay = res.docs.sort((a, b) => b.timestamp - a.timestamp)[0];
            console.log(new Date(lastDay.timestamp).toDateString());
            return lastDay;
        }).then(lastDay => {
            let databasesWillFix = ['closed_checks','checks', 'logs', 'cashbox', 'orders', 'receipts']; // 'checks', 'logs', 'cashbox', 'orders', 'receipts'
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

                    // let dayThat = lastDay.data_file.split('.')[0];
                    let dayThat = 1642732345000; 

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
        }).catch(err => {
            console.log(err);
        })
    })
}

export const getDeleted = async (store_id: string) => {
    try {
        const StoreDatabase = await StoreDB(store_id);
        let dbChanges = (await StoreDatabase.changes({ include_docs: false }))
        let data = dbChanges.results.filter(obj => obj.hasOwnProperty('deleted')).map(doc => doc.id);
        console.log(data.length);
        data.forEach(doc_id => {
            StoreDatabase.get(doc_id, { revs_info: true, }).then(res => {
                res._revs_info.filter(rev => rev.status == "available").forEach((obj, index) => {
                    console.log(obj);
                    StoreDatabase.get(doc_id, { rev: obj.rev }).then((res: any) => {
                        console.log(res);
                        // writeJsonFile('data' + index + '.json', res)
                    });
                })
            }).catch(err => {
                console.log(err);
            });
        })
    } catch (error) {
        console.log(error);
    }
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

            checks = checks.sort((a, b) => b.timestamp - a.timestamp);

            let newChecks = checks.filter(obj => new Date(obj.timestamp).getDay() == 1);
            let oldChecks = checks.filter(obj => new Date(obj.timestamp).getDay() == 0);

            // checks = checks.filter(obj => new Date(obj.timestamp).getDay() == new Date().getDay());

            checks = oldChecks;

            console.log(oldChecks.length);
            console.log(newChecks.length);


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

        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
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

export const allOrders = (db_name: string, check_id: string) => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' }, limit: 5000 }).then((res: any) => {
        const db: Database = res.docs[0];
        RemoteDB(db, db_name).find({ selector: { db_name: 'orders', check: check_id } }).then(res => {

            let orders: Order[] = res.docs.sort((a, b) => b.timestamp - a.timestamp);
            let tableData = []
            // orders.map(order => order.items )
            orders.forEach(order => {
                // console.log(order) 

                tableData = tableData.concat(order.items)

            });
            console.table(tableData);
            console.log('Toplam:        ', tableData.map(data => data.price).reduce((a, b) => a + b, 0));

        })

    }).catch(err => {
        console.log(err);
    })
}

export const reOpenCheck = (db_name: string, check_id: string) => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        const db: Database = res.docs[0];


        RemoteDB(db, db_name).get(check_id).then((check: Check) => {

            if (check.payment_flow) {
                check.payment_flow.forEach((payment) => {
                    check.discount = check.discount - payment.amount;
                    check.total_price += payment.amount;
                    payment.payed_products.forEach(product => {
                        check.products.push(product);
                    })
                })
                delete check.payment_flow
                RemoteDB(db, db_name).put(check).then(isCheckReOpened => {
                    console.log('Check Updated');
                })
            } else {

            }
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
}

export const allRevisions = (db_name: string, doc_id: string) => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        const db: Database = res.docs[0];
        RemoteDB(db, db_name).get(doc_id, { revs_info: true }).then(res => {
            res._revs_info.filter(rev => rev.status == "available").forEach((obj, index) => {
                console.log(obj);
                RemoteDB(db, db_name).get(doc_id, { rev: obj.rev }).then((res: any) => {
                    writeJsonFile('data' + index + '.json', res)
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

export const getSessions = async () => {
    // StoresDB.Sessions.allDocs()
    let owners = (await ManagementDB.Owners.find({ selector: {} })).docs;

    let sessions = (await StoresDB.Sessions.find({ selector: {} })).docs;

    sessions.sort((a, b) => b.timestamp - a.timestamp);
    let dataTable = [];
    sessions.forEach((session, index) => {

        if (owners.some(obj => obj._id == session.user_id)) {
            dataTable.push({
                Tarih: new Date(session.timestamp).toLocaleDateString('tr-TR'),
                Saat: new Date(session.timestamp).toLocaleTimeString('tr-TR'),
                Kullanıcı: owners.find(obj => obj._id == session.user_id)?.fullname,
                KullancıAdı: owners.find(obj => obj._id == session.user_id)?.username,
                Telefon: owners.find(obj => obj._id == session.user_id)?.phone_number
            })
        }
    });

    console.table(dataTable);



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
                }).catch(err => {
                    console.log(err);
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
    createIndexesForDatabase(ManagementDB.Products, { index: { fields: ['producer_id', 'brand_id', 'category', 'sub_category', 'barcode'] } }).then(res => {
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
    const parserOpts: OptionsV2 =  { ignoreAttrs: true, explicitArray: false, tagNameProcessors: [processors.stripPrefix], valueProcessors: [parseNumbers, parseBooleans] };
    const xmlParser = new Parser(parserOpts);
    const invoicePath = path.join(__dirname, '../', '/backup/d622f9dd-036b-4775-bbee-911d301c5b77/mikro.xml');
    readFile(invoicePath, (err, buffer) => {
        if (!err) {
            let data = buffer.toString('utf8');
            let productsTable = [];
            xmlParser.parseStringPromise(data).then((ubl:UBL) => {

                const Invoice = ubl.Invoice;

                console.log('       ')
                console.log(Invoice.UUID + ' ' + Invoice.ID);
                console.log('       ');
                console.log(Invoice.IssueDate + ' ' + Invoice.IssueTime);
                console.log('       ')
                console.log(Invoice.AccountingSupplierParty.Party.PartyName.Name);
                console.log('VD:  ' + Invoice.AccountingSupplierParty.Party.PartyTaxScheme.TaxScheme.Name);
                console.log('VN:  ' + Invoice.AccountingSupplierParty.Party.PartyIdentification[0].ID);
                console.log('       ')
                console.log(Invoice.AccountingCustomerParty.Party.PartyName.Name);
                console.log('VD:  ' + Invoice.AccountingCustomerParty.Party.PartyTaxScheme.TaxScheme.Name);
                console.log('VN:  ' + Invoice.AccountingCustomerParty.Party.PartyIdentification.ID);
                console.log('       ');
                // console.log('Ürün Toplamı:      ' + Invoice.LegalMonetaryTotal.LineExtensionAmount);
                // console.log('KDV siz Toplam:    ' + Invoice.LegalMonetaryTotal.TaxExclusiveAmount);
                // console.log('KDV li Toplam:     ' + Invoice.LegalMonetaryTotal.TaxInclusiveAmount);

                console.table(Invoice.InvoiceLine.map(obj => [obj.Item.Name, obj.InvoicedQuantity, obj.Price.PriceAmount,obj.TaxTotal.TaxAmount,obj.LineExtensionAmount]));

                console.log('       ');
                console.log('Ara Toplam:        ' + Invoice.LegalMonetaryTotal.TaxExclusiveAmount);
                console.log('KDV Toplamı:       ' + Invoice.TaxTotal.TaxAmount)
                console.log('Genel Toplam:      ' + Invoice.LegalMonetaryTotal.PayableAmount);


                // console.log(Invoice.AccountingSupplierParty.Party);
                // console.log(Invoice.InvoiceLine[0])
                // console.log(Invoice.InvoiceLine)


                // ubl['Invoice']['cac:InvoiceLine'].forEach(row => {
                //     let quantity = row["cbc:InvoicedQuantity"][0]["_"];
                //     let total_price = row["cbc:LineExtensionAmount"][0]["_"];
                //     // let currency = row["cbc:LineExtensionAmount"][0]["$"];
                //     // let discountAmount = row["cac:AllowanceCharge"][0]["cbc:Amount"][0]["_"];
                //     // let discountValue = row["cac:AllowanceCharge"][0]["cbc:MultiplierFactorNumeric"];
                //     // let withoutDiscount = row["cac:AllowanceCharge"][0]["cbc:BaseAmount"][0]["_"];
                //     let taxAmount = row["cac:TaxTotal"][0]["cbc:TaxAmount"][0]["_"];
                //     let taxPercent = row["cac:TaxTotal"][0]["cbc:Percent"];
                //     let itemName = row["cac:Item"][0]["cbc:Description"];
                //     let itemId = row["cac:Item"][0]["cbc:Name"];
                //     let itemPrice = row["cac:Price"][0]["cbc:PriceAmount"][0]["_"];

                //     let item = {
                //         quantity: parseInt(quantity),
                //         name: itemName[0],
                //         price: parseInt(total_price),
                //         taxAmount: taxAmount,
                //         taxPercent: taxPercent,
                //         total: (parseInt(quantity) * parseInt(total_price)),
                //     }

                //     productsTable.push(item);
                // });
                // console.table(productsTable);

                // writeJsonFile('invoice.json', invoiceJson).then(res => {
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

export const importFromBackup = async (store_id: string) => {
    // let Store = await ManagementDB.Stores.get(store_id);
    let backupFile: Array<BackupData> = await readJsonFile(backupPath + `${store_id}/db.dat`);
    let bulkResponse = await (await StoreDB(store_id)).bulkDocs(backupFile);
    console.log(bulkResponse);
};

export const clearDatabase = async (store_id: string) => {
    try {
        const Store: Store = await ManagementDB.Stores.get(store_id);
        const StoreDatabase = await StoreDB(store_id);
        const StoreDocuments = (await StoreDatabase.find({ selector: {}, limit: 50000 })).docs.map(obj => {
            delete obj._rev;
            return obj;
        });
        console.log(StoreDocuments[0])
        console.log('Docs Count:', StoreDocuments.length);
        purgeDatabase(Store.auth).then(res => {
            StoreDatabase.bulkDocs(StoreDocuments).then(docs => {
                let isAnyConflict = docs.some(doc => doc.hasOwnProperty('error'));
                if (isAnyConflict) {
                    console.log('There Are Some Conflicts')
                } else {
                    console.log('Looks Great')
                }
            })
        }).catch(err => {
            console.log(err);
        })
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

export const makePdf = async (store_id: string, start_date: number, end_date: number, endDayData?: Array<EndDay>) => {
    try {
        let StoreEndDays: Array<EndDay>;
        if (!endDayData) {
            StoreEndDays = (await (await StoreDB(store_id)).find({ selector: { db_name: 'endday' }, limit: 2500 })).docs
        } else {
            StoreEndDays = endDayData;
        }
        const Store: Store = await ManagementDB.Stores.get(store_id)
        const PDF = new jsPDF({ orientation: "portrait" });
        const MonthLabels = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasim", "Aralık"];
        const ReportDate = MonthLabels[new Date(start_date).getMonth()] + ' ' + new Date(start_date).getFullYear();

        const transformPrice = (value: number): string => {
            if (!value) value = 0;
            return Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' TL'; /// ₺
        }
        const totalProperty = (property: string) => {
            return transformPrice(filteredDays.map(obj => obj[property]).reduce((a, b) => a + b, 0))
        }

        let filteredDays = StoreEndDays.sort((a, b) => a.timestamp - b.timestamp).filter((day) => day.timestamp > start_date && day.timestamp < end_date)

        // hitDates.some(function(dateStr) {
        //     var date = new Date(dateStr);
        //     return date >= startDate && date <= endDate
        // });

        let tableBodyData = [];
        filteredDays.forEach((day, index) => {
            let data = [new Date(day.timestamp).toLocaleDateString('tr', { year: 'numeric', month: '2-digit', day: '2-digit' }), transformPrice(day.total_income), transformPrice(day.cash_total), transformPrice(day.card_total), transformPrice(day.coupon_total), transformPrice(day.free_total), transformPrice(day.canceled_total), transformPrice(day.discount_total)];
            tableBodyData.push(data);
        });
        let tableHeadData = [['Tarih', 'Toplam', 'Nakit', 'Kart', 'Kupon', 'Ikram', 'Iptal', 'Indirim']]
        let tableFootData = [['Genel Toplam', totalProperty('total_income'), totalProperty('cash_total'), totalProperty('card_total'), totalProperty('coupon_total'), totalProperty('free_total'), totalProperty('canceled_total'), totalProperty('discount_total')]]

        PDF.setLanguage('tr')
        PDF.text(Store.name + ' - ' + ReportDate + ' Raporu', 40, 16.5);
        PDF.addImage(Store.logo, 'PNG', 5, 0, 30, 30);

        autoTable(PDF, {
            startY: 30,
            styles: {
                // cellPadding: 5,
                // fontSize: 10,
                font: "helvetica", // helvetica, times, courier
                lineColor: 200,
                // lineWidth: 0.1,
                fontStyle: 'bold', // normal, bold, italic, bolditalic,
                overflow: 'ellipsize', // visible, hidden, ellipsize or linebreak
                // fillColor: 255,
                // textColor: 20,
                halign: 'right', // left, center, right
                valign: 'middle', // top, middle, bottom
                // fillStyle: 'F', // 'S', 'F' or 'DF' (stroke, fill or fill then stroke)
                // rowHeight: 20,
                // columnWidth: 'auto' // 'auto', 'wrap' or a number
            },
            head: tableHeadData,
            foot: tableFootData,
            body: tableBodyData,
            theme: 'plain',
            margin: { vertical: 0, horizontal: 0 },
            headStyles: { halign: "center", fillColor: [43, 62, 80], textColor: 255 },
            footStyles: { halign: "right", minCellHeight: 10, fillColor: [255, 255, 255], textColor: 0 },
            columnStyles: {
                0: { fillColor: [43, 62, 80], textColor: 255, fontStyle: 'normal' },
                1: { fillColor: [28, 40, 48], textColor: 255, fontStyle: 'normal' },
                2: { fillColor: [28, 40, 48], textColor: [98, 173, 101], fontStyle: 'normal' },
                3: { fillColor: [28, 40, 48], textColor: [232, 167, 84], fontStyle: 'normal' },
                4: { fillColor: [28, 40, 48], textColor: [87, 184, 205], fontStyle: 'normal' },
                5: { fillColor: [28, 40, 48], textColor: [181, 91, 82], fontStyle: 'normal' },
                6: { fillColor: [28, 40, 48], textColor: [186, 109, 46], fontStyle: 'normal' },
                7: { fillColor: [28, 40, 48], textColor: 255, fontStyle: 'normal' },
            },
        })

        const xlsxData = [].concat(tableHeadData, tableBodyData, tableFootData);
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(xlsxData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, ReportDate);

        XLSX.writeFile(wb, Store.name + '-' + ReportDate + '.xlsx');
        PDF.save(Store.name + '-' + ReportDate + '.pdf');
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
                    store_id: menu.store_id,
                    categories: menu.categories,
                    promotions: menu.promotions,
                    social_links: menu.socialLinks.map(obj => {
                        obj.name = obj.displayName;
                        delete obj.displayName;
                        return obj;
                    }),
                    status: MenuStatus.ACTIVE,
                    timestamp: Date.now(),
                    theme: { background: 'dark', brand: '', buttons: 'primary', fonts: '', greetings: 'success', segment: 'dark' },
                }
                console.log(newMenu);
            })
        })
    })


}

export const clearStoreProducts = async (store_id: string) => {

    const StoreDatabase = await StoreDB(store_id);

    const products = (await StoreDatabase.find({ selector: { db_name: 'products' }, limit: 2000 })).docs;
    const categories = (await StoreDatabase.find({ selector: { db_name: 'categories' }, limit: 2000 })).docs;
    const sub_categories = (await StoreDatabase.find({ selector: { db_name: 'sub_categories' }, limit: 2000 })).docs;
    const reports = (await StoreDatabase.find({ selector: { db_name: 'reports', type: 'Product' }, limit: 2000 })).docs;

    let docsWillRemove = [].concat(products, categories, sub_categories, reports);

    console.log(docsWillRemove);

    docsWillRemove.map(obj => obj._deleted = true);

    let isRemoved = await StoreDatabase.bulkDocs(docsWillRemove);

    console.log(isRemoved)

}

export const loadStoreBackup = async (store_id: string,db_name:string) => {
    try {
        const Store = await ManagementDB.Stores.get(store_id);

        // console.log(Store.auth);

        const StoreDatabase = await StoreDB(store_id);

        let backup = await readJsonFile(backupPath + `${store_id}/db.dat`);

        backup = backup.filter(obj => obj.db_name == db_name);
        console.log(backup.length);

        let storeTables = (await StoreDatabase.find({selector:{db_name:db_name},limit:DatabaseQueryLimit})).docs;
        console.log(storeTables.length);
        // backup.forEach(async element => {
        //     if(storeTables.find(obj => obj.name == element.name)){
        //         // console.log(element.name);
        //     }else{
        //         console.log(element.name);
        //         let isOk = await StoreDatabase.put(element);
        //         console.log(isOk);            }
        // });

        // let isOK = await StoreDatabase.bulkDocs(backup);

        // console.log(isOK)

    } catch (error) {
        console.log(error)
        
    }
}

export const menuToTerminal = async (store_id: string) => {
    try {
        const Database = await (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
        const StoreDatabase = await StoreDB(store_id);
        const MenuDatabase = RemoteDB(Database, 'quickly-menu-app');

        const Menu: Menu = await (await MenuDatabase.find({ selector: { store_id: store_id } })).docs[0];

        Menu.categories.forEach((category, index) => {
            let newCategory: Category = { name: category.name, description: '', status: 0, order: index, tags: '', printer: 'Bar' }

            StoreDatabase.find({ selector: { db_name: 'categories', name: category.name } }).then(isCatAvailable => {
                if (isCatAvailable.docs.length > 0) {
                    //// Category Exist
                    let cat_res = isCatAvailable.docs[0];

                    if (category.item_groups.length > 0) {

                        category.item_groups.forEach(sub_cat => {

                            let newSubCategory: SubCategory = { name: sub_cat.name, description: '', status: 0, cat_id: cat_res.id }

                            StoreDatabase.find({ selector: { db_name: 'sub_categories', name: sub_cat.name } }).then(isSubCatAvailable => {
                                if (isSubCatAvailable.docs.length > 0) {
                                    //// SubCategory Exist
                                    let sub_cat_res = isSubCatAvailable.docs[0];
                                    console.log('! Alt Kategori Zaten Var', sub_cat_res.name);
                                    sub_cat.items.forEach(item => {
                                        if (item.price) {
                                            let newProduct: Product = { name: item.name, description: item.description, type: 1, status: 0, price: item.price, barcode: 0, notes: null, specifies: [], cat_id: cat_res.id, subcat_id: sub_cat_res.id, tax_value: 8, }
                                            StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                                item.product_id = product_res.id;
                                                console.log('+ Ürün Eklendi', newCategory.name);

                                                /////////////////////////////////////////////////////////////
                                                ////////////////////      Report    /////////////////////////
                                                newProduct._id = product_res.id;
                                                newProduct._rev = product_res.rev;
                                                let newReport = createReport('Product', newProduct);
                                                StoreDatabase.post(newReport).then(res => {
                                                    console.log('+ Rapor Eklendi', newReport.description);
                                                }).catch(err => {
                                                    console.log('Rapor Hatası', newReport.description)
                                                })
                                                /////////////////////////////////////////////////////////////
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
                                            let newProduct: Product = { name: item.name, description: item.description, type: 1, status: 0, price: specs[0].spec_price, barcode: 0, notes: null, specifies: specs, cat_id: cat_res.id, subcat_id: sub_cat_res.id, tax_value: 8, }
                                            StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                                console.log('+ Ürün Eklendi', newCategory.name);

                                                item.product_id = product_res.id;

                                                /////////////////////////////////////////////////////////////
                                                ////////////////////      Report    /////////////////////////
                                                newProduct._id = product_res.id;
                                                newProduct._rev = product_res.rev;
                                                let newReport = createReport('Product', newProduct);
                                                StoreDatabase.post(newReport).then(res => {
                                                    console.log('+ Rapor Eklendi', newReport.description);
                                                }).catch(err => {
                                                    console.log('Rapor Hatası', newReport.description)
                                                })
                                                /////////////////////////////////////////////////////////////
                                            }).catch(err => {
                                                console.log('Ürün Hatası', item.name)
                                            })
                                        }
                                    })
                                } else {
                                    //// SubCategory Not Exist
                                    StoreDatabase.post({ db_name: 'sub_categories', ...newSubCategory }).then(sub_cat_res => {
                                        sub_cat.id = sub_cat_res.id;
                                        console.log('+ Alt Kategori Eklendi', newCategory.name);
                                        sub_cat.items.forEach(item => {
                                            if (item.price) {
                                                let newProduct: Product = { name: item.name, description: item.description, type: 1, status: 0, price: item.price, barcode: 0, notes: null, specifies: [], cat_id: cat_res.id, subcat_id: sub_cat_res.id, tax_value: 8, }
                                                StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                                    item.product_id = product_res.id;
                                                    console.log('+ Ürün Eklendi', newCategory.name);

                                                    /////////////////////////////////////////////////////////////
                                                    ////////////////////      Report    /////////////////////////
                                                    newProduct._id = product_res.id;
                                                    newProduct._rev = product_res.rev;
                                                    let newReport = createReport('Product', newProduct);
                                                    StoreDatabase.post(newReport).then(res => {
                                                        console.log('+ Rapor Eklendi', newReport.description);
                                                    }).catch(err => {
                                                        console.log('Rapor Hatası', newReport.description)
                                                    })
                                                    /////////////////////////////////////////////////////////////
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
                                                let newProduct: Product = { name: item.name, description: item.description, type: 1, status: 0, price: specs[0].spec_price, barcode: 0, notes: null, specifies: specs, cat_id: cat_res.id, subcat_id: sub_cat_res.id, tax_value: 8, }
                                                StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                                    console.log('+ Ürün Eklendi', newCategory.name);

                                                    item.product_id = product_res.id;

                                                    /////////////////////////////////////////////////////////////
                                                    ////////////////////      Report    /////////////////////////
                                                    newProduct._id = product_res.id;
                                                    newProduct._rev = product_res.rev;
                                                    let newReport = createReport('Product', newProduct);
                                                    StoreDatabase.post(newReport).then(res => {
                                                        console.log('+ Rapor Eklendi', newReport.description);
                                                    }).catch(err => {
                                                        console.log('Rapor Hatası', newReport.description)
                                                    })
                                                    /////////////////////////////////////////////////////////////
                                                }).catch(err => {
                                                    console.log('Ürün Hatası', item.name)
                                                })
                                            }
                                        })
                                    }).catch(err => {
                                        console.log('Alt Kategori Hatası', category.name)
                                    });
                                }
                            })
                        });
                    } else {
                        category.items.forEach(item => {
                            if (item.price) {
                                let newProduct: Product = { name: item.name, description: item.description, type: 0, status: 0, price: item.price, barcode: 0, notes: null, specifies: [], cat_id: cat_res.id, tax_value: 8, }
                                StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                    console.log('+ Ürün Eklendi', newCategory.name);
                                    item.product_id = product_res.id;
                                    /////////////////////////////////////////////////////////////
                                    ////////////////////      Report    /////////////////////////
                                    newProduct._id = product_res.id;
                                    newProduct._rev = product_res.rev;
                                    let newReport = createReport('Product', newProduct);
                                    StoreDatabase.post(newReport).then(res => {
                                        console.log('+ Rapor Eklendi', newReport.description);
                                    }).catch(err => {
                                        console.log('Rapor Hatası', newReport.description)
                                    })
                                    /////////////////////////////////////////////////////////////

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
                                    item.product_id = product_res.id;
                                    /////////////////////////////////////////////////////////////
                                    ////////////////////      Report    /////////////////////////
                                    newProduct._id = product_res.id;
                                    newProduct._rev = product_res.rev;
                                    let newReport = createReport('Product', newProduct);
                                    StoreDatabase.post(newReport).then(res => {
                                        console.log('+ Rapor Eklendi', newReport.description);
                                    }).catch(err => {
                                        console.log('Rapor Hatası', newReport.description)
                                    })
                                    /////////////////////////////////////////////////////////////
                                }).catch(err => {
                                    console.log('Ürün Hatası', item.name)
                                })
                            }
                        })
                    }
                } else {
                    ///// Category Not Exist
                    StoreDatabase.post({ db_name: 'categories', ...newCategory }).then(cat_res => {
                        console.log('+ Kategori Eklendi', newCategory.name);
                        category.id = cat_res.id;
                        if (category.item_groups.length > 0) {
                            category.item_groups.forEach(sub_cat => {
                                let newSubCategory: SubCategory = { name: sub_cat.name, description: '', status: 0, cat_id: cat_res.id }
                                StoreDatabase.post({ db_name: 'sub_categories', ...newSubCategory }).then(sub_cat_res => {
                                    sub_cat.id = sub_cat_res.id;
                                    console.log('+ Alt Kategori Eklendi', newCategory.name);
                                    sub_cat.items.forEach(item => {
                                        if (item.price) {
                                            let newProduct: Product = { name: item.name, description: item.description, type: 1, status: 0, price: item.price, barcode: 0, notes: null, specifies: [], cat_id: cat_res.id, subcat_id: sub_cat_res.id, tax_value: 8, }
                                            StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                                item.product_id = product_res.id;
                                                console.log('+ Ürün Eklendi', newCategory.name);

                                                /////////////////////////////////////////////////////////////
                                                ////////////////////      Report    /////////////////////////
                                                newProduct._id = product_res.id;
                                                newProduct._rev = product_res.rev;
                                                let newReport = createReport('Product', newProduct);
                                                StoreDatabase.post(newReport).then(res => {
                                                    console.log('+ Rapor Eklendi', newReport.description);
                                                }).catch(err => {
                                                    console.log('Rapor Hatası', newReport.description)
                                                })
                                                /////////////////////////////////////////////////////////////
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
                                            let newProduct: Product = { name: item.name, description: item.description, type: 1, status: 0, price: specs[0].spec_price, barcode: 0, notes: null, specifies: specs, cat_id: cat_res.id, subcat_id: sub_cat_res.id, tax_value: 8, }
                                            StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                                console.log('+ Ürün Eklendi', newCategory.name);

                                                item.product_id = product_res.id;

                                                /////////////////////////////////////////////////////////////
                                                ////////////////////      Report    /////////////////////////
                                                newProduct._id = product_res.id;
                                                newProduct._rev = product_res.rev;
                                                let newReport = createReport('Product', newProduct);
                                                StoreDatabase.post(newReport).then(res => {
                                                    console.log('+ Rapor Eklendi', newReport.description);
                                                }).catch(err => {
                                                    console.log('Rapor Hatası', newReport.description)
                                                })
                                                /////////////////////////////////////////////////////////////
                                            }).catch(err => {
                                                console.log('Ürün Hatası', item.name)
                                            })
                                        }
                                    })
                                }).catch(err => {
                                    console.log('Alt Kategori Hatası', category.name)
                                });
                            });
                        } else {
                            category.items.forEach(item => {
                                if (item.price) {
                                    let newProduct: Product = { name: item.name, description: item.description, type: 0, status: 0, price: item.price, barcode: 0, notes: null, specifies: [], cat_id: cat_res.id, tax_value: 8, }
                                    StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                        console.log('+ Ürün Eklendi', newCategory.name);
                                        item.product_id = product_res.id;
                                        /////////////////////////////////////////////////////////////
                                        ////////////////////      Report    /////////////////////////
                                        newProduct._id = product_res.id;
                                        newProduct._rev = product_res.rev;
                                        let newReport = createReport('Product', newProduct);
                                        StoreDatabase.post(newReport).then(res => {
                                            console.log('+ Rapor Eklendi', newReport.description);
                                        }).catch(err => {
                                            console.log('Rapor Hatası', newReport.description)
                                        })
                                        /////////////////////////////////////////////////////////////

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
                                        item.product_id = product_res.id;
                                        /////////////////////////////////////////////////////////////
                                        ////////////////////      Report    /////////////////////////
                                        newProduct._id = product_res.id;
                                        newProduct._rev = product_res.rev;
                                        let newReport = createReport('Product', newProduct);
                                        StoreDatabase.post(newReport).then(res => {
                                            console.log('+ Rapor Eklendi', newReport.description);
                                        }).catch(err => {
                                            console.log('Rapor Hatası', newReport.description)
                                        })
                                        /////////////////////////////////////////////////////////////
                                    }).catch(err => {
                                        console.log('Ürün Hatası', item.name)
                                    })
                                }
                            })
                        }
                    }).catch(err => {
                        console.log('Kategori Hatası', category.name)
                    })
                }
            })
        })
    } catch (error) {
        console.log(error);
    }

}

export const menuToTerminal2 = async (store_id: string) => {
    try {
        const Database = await (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
        const StoreDatabase = await StoreDB(store_id);
        const MenuDatabase = RemoteDB(Database, 'quickly-menu-app');

        const Menu: any = await (await MenuDatabase.find({ selector: { store_id: store_id } })).docs[0];

        let selectedCategories = Menu.categories
        // .filter(obj => obj.name == 'Kokteyller / Cocktails');
        console.log(selectedCategories);
        selectedCategories.forEach((category, index) => {
            let newCategory: any = { name: category.name, description: '', status: 0, order: index, tags: '', printer: 'Bar' }
            StoreDatabase.post({ db_name: 'categories', ...newCategory }).then(cat_res => {
                console.log('+ Kategori Eklendi', newCategory.name);
                category.id = cat_res.id;
                if (category.item_groups.length > 0) {
                    category.item_groups.forEach(sub_cat => {
                        let newSubCategory: SubCategory = { name: sub_cat.name, description: '', status: 0, cat_id: cat_res.id }
                        StoreDatabase.post({ db_name: 'sub_categories', ...newSubCategory }).then(sub_cat_res => {
                            sub_cat.id = sub_cat_res.id;
                            console.log('+ Alt Kategori Eklendi', newCategory.name);
                            sub_cat.items.forEach(item => {
                                if (!item.options || item.options.length == 0) {
                                    let newProduct: Product = { name: item.name, description: item.description, type: 1, status: 0, price: parseInt(item.price), barcode: 0, notes: null, specifies: [], cat_id: cat_res.id, subcat_id: sub_cat_res.id, tax_value: 8, }
                                    StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                        item.product_id = product_res.id;
                                        console.log('+ Ürün Eklendi', newCategory.name);

                                        /////////////////////////////////////////////////////////////
                                        ////////////////////      Report    /////////////////////////
                                        newProduct._id = product_res.id;
                                        newProduct._rev = product_res.rev;
                                        let newReport = createReport('Product', newProduct);
                                        StoreDatabase.post(newReport).then(res => {
                                            console.log('+ Rapor Eklendi', newReport.description);
                                        }).catch(err => {
                                            console.log('Rapor Hatası', newReport.description)
                                        })
                                        /////////////////////////////////////////////////////////////
                                    }).catch(err => {
                                        console.log('Ürün Hatası', item.name)
                                    })
                                } else {
                                    let specs: Array<ProductSpecs> = [];
                                    item.options.forEach(opts => {
                                        let spec: ProductSpecs = {
                                            spec_name: opts.name,
                                            spec_price: parseInt(opts.price)
                                        }
                                        specs.push(spec);
                                    })
                                    let newProduct: Product = { name: item.name, description: item.description, type: 1, status: 0, price: specs[0].spec_price, barcode: 0, notes: null, specifies: specs, cat_id: cat_res.id, subcat_id: sub_cat_res.id, tax_value: 8, }
                                    StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                        console.log('+ Ürün Eklendi', newCategory.name);

                                        item.product_id = product_res.id;

                                        /////////////////////////////////////////////////////////////
                                        ////////////////////      Report    /////////////////////////
                                        newProduct._id = product_res.id;
                                        newProduct._rev = product_res.rev;
                                        let newReport = createReport('Product', newProduct);
                                        StoreDatabase.post(newReport).then(res => {
                                            console.log('+ Rapor Eklendi', newReport.description);
                                        }).catch(err => {
                                            console.log('Rapor Hatası', newReport.description)
                                        })
                                        /////////////////////////////////////////////////////////////
                                    }).catch(err => {
                                        console.log('Ürün Hatası', item.name)
                                    })
                                }
                            })
                        }).catch(err => {
                            console.log('Alt Kategori Hatası', category.name)
                        });
                    });
                } else {
                    category.items.forEach(item => {
                        if (!item.options || item.options.length == 0) {
                            let newProduct: any = { name: item.name, description: item.description, type: 0, status: 0, price: parseInt(item.price), barcode: 0, notes: null, specifies: [], cat_id: cat_res.id, tax_value: 8, }
                            StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                console.log('+ Ürün Eklendi', newCategory.name);
                                item.product_id = product_res.id;
                                /////////////////////////////////////////////////////////////
                                ////////////////////      Report    /////////////////////////
                                newProduct._id = product_res.id;
                                newProduct._rev = product_res.rev;
                                let newReport = createReport('Product', newProduct);
                                StoreDatabase.post(newReport).then(res => {
                                    console.log('+ Rapor Eklendi', newReport.description);
                                }).catch(err => {
                                    console.log('Rapor Hatası', newReport.description)
                                })
                                /////////////////////////////////////////////////////////////

                            }).catch(err => {
                                console.log('Ürün Hatası', item.name)
                            })
                        } else {
                            let specs: Array<ProductSpecs> = [];
                            item.options.forEach(opts => {
                                let spec: ProductSpecs = {
                                    spec_name: opts.name,
                                    spec_price: parseInt(opts.price)
                                }
                                specs.push(spec);
                            })
                            let newProduct: Product = { name: item.name, description: item.description, type: 0, status: 0, price: specs[0].spec_price, barcode: 0, notes: null, specifies: specs, cat_id: cat_res.id, tax_value: 8, }
                            StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
                                console.log('+ Ürün Eklendi', newCategory.name);
                                item.product_id = product_res.id;
                                /////////////////////////////////////////////////////////////
                                ////////////////////      Report    /////////////////////////
                                newProduct._id = product_res.id;
                                newProduct._rev = product_res.rev;
                                let newReport = createReport('Product', newProduct);
                                StoreDatabase.post(newReport).then(res => {
                                    console.log('+ Rapor Eklendi', newReport.description);
                                }).catch(err => {
                                    console.log('Rapor Hatası', newReport.description)
                                })
                                /////////////////////////////////////////////////////////////
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


export const updateTerminalWithMenu = async (store_id: string) => {
            try {
                const Database = await (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
                const StoreDatabase = await StoreDB(store_id);
                const MenuDatabase = RemoteDB(Database, 'quickly-menu-app');

                let StoreProducts:Array<Product> = (await StoreDatabase.find({ selector: { db_name: 'products' }, limit: DatabaseQueryLimit })).docs;

                let BulkUpdateDocs:Array<Product> = [];
        
                const Menu: Menu = await (await MenuDatabase.find({ selector: { store_id: store_id } })).docs[0];
        
                let selectedCategories = Menu.categories;


                selectedCategories.forEach((category, index) => {

                    if(category.items.length > 0){
                        category.items.forEach(obj => {
                            let product = StoreProducts.find(product => product.name.toLocaleLowerCase() == obj.name.toLocaleLowerCase());
                            if(product){
                                product.price = obj.price;
                                if(obj?.options && obj?.options.length > 0){
                                    if(product?.specifies){
                                        product.specifies = [];
                                        obj.options.forEach(opt => {
                                            product.specifies.push({spec_name:opt.name,spec_price:opt.price});
                                        })
                                    }else{
                                        product.specifies = [];
                                        obj.options.forEach(opt => {
                                            product.specifies.push({spec_name:opt.name,spec_price:opt.price});
                                        })
                                    }
                                }
                                BulkUpdateDocs.push(product);
                            }else{
                                console.log('newProduct',obj.name,obj.price);
                                // if(obj?.options && obj?.options.length > 0){
                                //     if(product?.specifies){
                                //         product.specifies = [];
                                //         obj.options.forEach(opt => {
                                //             product.specifies.push({spec_name:opt.name,spec_price:opt.price});
                                //         })
                                //     }else{
                                //         product.specifies = [];
                                //         obj.options.forEach(opt => {
                                //             product.specifies.push({spec_name:opt.name,spec_price:opt.price});
                                //         })
                                //     }
                                // }
                            }
                        })
                    }
                    if(category.item_groups.length > 0){
                        category.item_groups.forEach(sub_cat => {
                            if(sub_cat.items.length > 0){
                                sub_cat.items.forEach(obj => {
                                    let product = StoreProducts.find(product => product.name.toLocaleLowerCase() == obj.name.toLocaleLowerCase());
                                    if(product){
                                        product.price = obj.price;
                                        if(obj?.options && obj?.options.length > 0){
                                            if(product?.specifies){
                                                product.specifies = [];
                                                obj.options.forEach(opt => {
                                                    product.specifies.push({spec_name:opt.name,spec_price:opt.price});
                                                })
                                            }else{
                                                product.specifies = [];
                                                obj.options.forEach(opt => {
                                                    product.specifies.push({spec_name:opt.name,spec_price:opt.price});
                                                })
                                            }
                                        }
                                        BulkUpdateDocs.push(product);
                                    }else{
                                        console.log('newProduct',obj.name,obj.price);
                                        // if(obj?.options && obj?.options.length > 0){

                                        // }
                                    }
                                })
                            }
                        });
                    }
                })

                console.log(BulkUpdateDocs.length);

                // let updateOps = await StoreDatabase.bulkDocs(BulkUpdateDocs);
                // console.log(updateOps.length);
            } catch (error) {
                console.log(error);
            }
}

export const storesInfo2 = async () => {
    const OwnerID: string = 'bbe63bd6-b3bd-4011-ad7e-88180d3d0b0f' // req.app.locals.user;
    const OwnerStores = await (await ManagementDB.Owners.get(OwnerID)).stores;
    const Stores = await (await ManagementDB.Stores.allDocs({ include_docs: true, keys: OwnerStores })).rows.map(obj => obj.doc);


    console.log(Stores);

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
    const t0 = performance.now();

    const Days: Array<EndDay> = (await (await StoreDB(store_id)).find({ selector: { db_name: 'endday' } })).docs.sort((a, b) => a.timestamp - b.timestamp);
    const BackupData: Array<BackupData> = await StoreReport(store_id,'1641938574500') // await StoreReport(store_id, Days[0].timestamp.toString(), Days[Days.length - 1].timestamp.toString());
    const Checks: Array<ClosedCheck> = BackupData.find(backup => backup.database == 'closed_checks').docs;
    const Sales = ProductsReport(Checks);
    console.log(Sales);


    const t1 = performance.now();
    console.log(`Call took ${t1 - t0} milliseconds.`);
}

export const menuFixer = async () => {
    try {
        const Database = await (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
        // const StoreDatabase = await StoreDB(store_id);
        const MenuDatabase = RemoteDB(Database, 'quickly-menu-app');

        let Menus: Menu[] = await (await MenuDatabase.find({ selector: {}, limit: DatabaseQueryLimit })).docs;

        console.log(Menus.length);

        Menus.map((menu, index) => {
            menu.categories.map((category, index) => {
                category.items.map((product: any) => {
                    product.is_hidden = false;
                    product.is_available = true;
                    product.product_id = '';
                    delete product.isHidden;
                    delete product.productId;
                })
                category.item_groups.map(sub_cat => {
                    sub_cat.items.map((product: any) => {
                        product.is_hidden = false;
                        product.is_available = true;
                        product.product_id = '';
                        delete product.isHidden;
                        delete product.productId;
                    })
                })
            })
        })

        // console.log(Menus);

        // setTimeout(() => {
        //     MenuDatabase.bulkDocs(Menus).then(res => {
        //         console.log(res);
        //     })
        // }, 5000)




        // Menu.categories.forEach((category, index) => {
        //     let newCategory: Category = { name: category.name, description: '', status: 0, order: index, tags: '', printer: 'Bar' }
        //     StoreDatabase.post({ db_name: 'categories', ...newCategory }).then(cat_res => {
        //         console.log('+ Kategori Eklendi', newCategory.name);
        //         category.id = cat_res.id;
        //         if (category.item_groups.length > 0) {
        //             category.item_groups.forEach(sub_cat => {
        //                 let newSubCategory: SubCategory = { name: sub_cat.name, description: '', status: 0, cat_id: cat_res.id }
        //                 StoreDatabase.post({ db_name: 'sub_categories', ...newSubCategory }).then(sub_cat_res => {
        //                     sub_cat.id = sub_cat_res.id;
        //                     console.log('+ Alt Kategori Eklendi', newCategory.name);
        //                     sub_cat.items.forEach(item => {
        //                         if (item.price) {
        //                             let newProduct: Product = { name: item.name, description: item.description, type: 1, status: 0, price: item.price, barcode: 0, notes: null, specifies: [], cat_id: cat_res.id, subcat_id: sub_cat_res.id, tax_value: 8, }
        //                             StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
        //                                 item.product_id = product_res.id;
        //                                 console.log('+ Ürün Eklendi', newCategory.name);
        //                                 /////////////////////////////////////////////////////////////
        //                                 ////////////////////      Report    /////////////////////////
        //                                 newProduct._id = product_res.id;
        //                                 newProduct._rev = product_res.rev;
        //                                 let newReport = createReport('Product', newProduct);
        //                                 StoreDatabase.post(newReport).then(res => {
        //                                     console.log('+ Rapor Eklendi', newReport.description);
        //                                 }).catch(err => {
        //                                     console.log('Rapor Hatası', newReport.description)
        //                                 })
        //                                 /////////////////////////////////////////////////////////////
        //                             }).catch(err => {
        //                                 console.log('Ürün Hatası', item.name)
        //                             })
        //                         } else {
        //                             let specs: Array<ProductSpecs> = [];
        //                             item.options.forEach(opts => {
        //                                 let spec: ProductSpecs = {
        //                                     spec_name: opts.name,
        //                                     spec_price: opts.price
        //                                 }
        //                                 specs.push(spec);
        //                             })
        //                             let newProduct: Product = { name: item.name, description: item.description, type: 1, status: 0, price: specs[0].spec_price, barcode: 0, notes: null, specifies: specs, cat_id: cat_res.id, subcat_id: sub_cat_res.id, tax_value: 8, }
        //                             StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
        //                                 console.log('+ Ürün Eklendi', newCategory.name);

        //                                 item.product_id = product_res.id;

        //                                 /////////////////////////////////////////////////////////////
        //                                 ////////////////////      Report    /////////////////////////
        //                                 newProduct._id = product_res.id;
        //                                 newProduct._rev = product_res.rev;
        //                                 let newReport = createReport('Product', newProduct);
        //                                 StoreDatabase.post(newReport).then(res => {
        //                                     console.log('+ Rapor Eklendi', newReport.description);
        //                                 }).catch(err => {
        //                                     console.log('Rapor Hatası', newReport.description)
        //                                 })
        //                                 /////////////////////////////////////////////////////////////
        //                             }).catch(err => {
        //                                 console.log('Ürün Hatası', item.name)
        //                             })
        //                         }
        //                     })
        //                 }).catch(err => {
        //                     console.log('Alt Kategori Hatası', category.name)
        //                 });
        //             });
        //         } else {
        //             category.items.forEach(item => {
        //                 if (item.price) {
        //                     let newProduct: Product = { name: item.name, description: item.description, type: 0, status: 0, price: item.price, barcode: 0, notes: null, specifies: [], cat_id: cat_res.id, tax_value: 8, }
        //                     StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
        //                         console.log('+ Ürün Eklendi', newCategory.name);
        //                         item.product_id = product_res.id;
        //                         /////////////////////////////////////////////////////////////
        //                         ////////////////////      Report    /////////////////////////
        //                         newProduct._id = product_res.id;
        //                         newProduct._rev = product_res.rev;
        //                         let newReport = createReport('Product', newProduct);
        //                         StoreDatabase.post(newReport).then(res => {
        //                             console.log('+ Rapor Eklendi', newReport.description);
        //                         }).catch(err => {
        //                             console.log('Rapor Hatası', newReport.description)
        //                         })
        //                         /////////////////////////////////////////////////////////////

        //                     }).catch(err => {
        //                         console.log('Ürün Hatası', item.name)
        //                     })
        //                 } else {
        //                     let specs: Array<ProductSpecs> = [];
        //                     item.options.forEach(opts => {
        //                         let spec: ProductSpecs = {
        //                             spec_name: opts.name,
        //                             spec_price: opts.price
        //                         }
        //                         specs.push(spec);
        //                     })
        //                     let newProduct: Product = { name: item.name, description: item.description, type: 0, status: 0, price: specs[0].spec_price, barcode: 0, notes: null, specifies: specs, cat_id: cat_res.id, tax_value: 8, }
        //                     StoreDatabase.post({ db_name: 'products', ...newProduct }).then(product_res => {
        //                         console.log('+ Ürün Eklendi', newCategory.name);
        //                         item.product_id = product_res.id;
        //                         /////////////////////////////////////////////////////////////
        //                         ////////////////////      Report    /////////////////////////
        //                         newProduct._id = product_res.id;
        //                         newProduct._rev = product_res.rev;
        //                         let newReport = createReport('Product', newProduct);
        //                         StoreDatabase.post(newReport).then(res => {
        //                             console.log('+ Rapor Eklendi', newReport.description);
        //                         }).catch(err => {
        //                             console.log('Rapor Hatası', newReport.description)
        //                         })
        //                         /////////////////////////////////////////////////////////////
        //                     }).catch(err => {
        //                         console.log('Ürün Hatası', item.name)
        //                     })
        //                 }
        //             })
        //         }
        //     }).catch(err => {
        //         console.log('Kategori Hatası', category.name)
        //     })
        // })
    } catch (error) {
        console.log(error);
    }

}

export const deletedRestore = async (store_id: string) => {
    //    let results = await (await StoreDB(store_id)).changes()
    //    console.log(results);
}

export const creationDateOfStores = () => {
    ManagementDB.Stores.find({ selector: {} }).then(res => {
        let stores = res.docs.sort((a, b) => a.timestamp - b.timestamp);

        let dataTable = [];

        stores.forEach(obj => {
            dataTable.push({
                İşletme: obj.name,
                Tarih: new Date(obj.timestamp).toLocaleDateString('tr-TR'),
            })
        })

        console.table(dataTable);


    })

}

export const quicklySellingData = async (year: number, month:number) => {
    const monthlyLabels = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

    const Stores = (await ManagementDB.Stores.find({ selector: {} })).docs;

    let Days = [];
    let Months = [];

    for (const store of Stores) {

        let storeEndDayData: Array<EndDay> = (await (await StoreDB(store._id)).find({ selector: { db_name: 'endday' }, limit: DatabaseQueryLimit })).docs

        let endDayData = storeEndDayData.filter(obj => new Date(obj.timestamp).getFullYear() == year && new Date(obj.timestamp).getMonth() ==  month);

        if (endDayData.length > 0) {

            console.log(store.name);

            endDayData.forEach((obj, index) => {

                let Schema = {
                    cash: (typeof obj.cash_total === 'number' ? obj.cash_total : 0),
                    card: (typeof obj.card_total === 'number' ? obj.card_total : 0),
                    coupon: (typeof obj.coupon_total === 'number' ? obj.coupon_total : 0),
                    free: (typeof obj.free_total === 'number' ? obj.free_total : 0),
                    total: (typeof obj.total_income === 'number' ? obj.total_income : 0),
                    checks: (typeof obj.check_count === 'number' ? obj.check_count : 0),
                    month: new Date(obj.timestamp).getMonth(),
                    year: new Date(obj.timestamp).getFullYear()
                };

                Days.push(Schema);




                // if (index == endDayData.length - 1) {
                //     let cash = { label: 'Nakit', data: [] };
                //     let coupon = { label: 'Kupon', data: [] };
                //     let card = { label: 'Kart', data: [] };
                //     let free = { label: 'İkram', data: [] };
                //     let total = { label: 'Toplam', data: [] };

                //     monthlyLabels.forEach((monthName, monthIndex) => {
                //         let monthWillProcess = Days.filter(obj => obj.month == monthIndex);
                //         if (monthWillProcess.length > 1) {
                //             cash.data[monthIndex] = monthWillProcess.map(obj => obj.cash).reduce((a, b) => a + b, 0);
                //             card.data[monthIndex] = monthWillProcess.map(obj => obj.card).reduce((a, b) => a + b);
                //             coupon.data[monthIndex] = monthWillProcess.map(obj => obj.coupon).reduce((a, b) => a + b);
                //             free.data[monthIndex] = monthWillProcess.map(obj => obj.free).reduce((a, b) => a + b);
                //             total.data[monthIndex] = monthWillProcess.map(obj => obj.total).reduce((a, b) => a + b);
                //         } else if (monthWillProcess.length == 1) {
                //             cash.data[monthIndex] = monthWillProcess[0].cash;
                //             card.data[monthIndex] = monthWillProcess[0].card;
                //             coupon.data[monthIndex] = monthWillProcess[0].coupon;
                //             free.data[monthIndex] = monthWillProcess[0].free;
                //             total.data[monthIndex] = monthWillProcess[0].total;
                //         } else {
                //             cash.data[monthIndex] = 0;
                //             card.data[monthIndex] = 0;
                //             coupon.data[monthIndex] = 0;
                //             free.data[monthIndex] = 0;
                //             total.data[monthIndex] = 0;
                //         }
                //         if (monthIndex == monthlyLabels.length - 1) {
                //             Months.push(cash, coupon, card, free, total);
                //             console.table(Months);
                //         }
                //     });
                // }
            });





        }

    }

    let Data = {
        cash: Days.map(x => x.cash).reduce((a, b) => a + b, 0),
        card: Days.map(x => x.card).reduce((a, b) => a + b, 0),
        coupon: Days.map(x => x.coupon).reduce((a, b) => a + b, 0),
        free: Days.map(x => x.free).reduce((a, b) => a + b, 0),
        total: Days.map(x => x.total).reduce((a, b) => a + b, 0),
        checks: Days.map(x => x.checks).reduce((a, b) => a + b, 0)
    }

    console.log(Data);



}

export const generateReportsFor = async (store_id: string, type: reportType) => {

    const StoreDatabase = await StoreDB(store_id);
    const Documents = await StoreDatabase.find({ selector: { db_name: type.toLowerCase() + 's' }, limit: DatabaseQueryLimit })
    console.log(Documents.docs[10]);
    let ReportsArray = [];
    for (const document of Documents.docs) {
        const Report = createReport(type, document);
        const Response = await StoreDatabase.post(Report);
        console.log(Response);
    }
    // const BulkPost = await StoreDatabase.bulkDocs(ReportsArray);
    // console.log(BulkPost);
}

export const clearOrders = async (store_id: string) => {
    try {
        const StoreDatabase = await StoreDB(store_id);
        let Documents = await StoreDatabase.find({ selector: { db_name: 'orders' }, limit: 40000 })
        console.log(Documents.docs.length);
    
        Documents.docs.map(obj => {
            obj._deleted = true;
            return obj
        })
        const BulkPost = await StoreDatabase.bulkDocs(Documents.docs);
        console.log(BulkPost);
    } catch (error) {
        console.log(error)
    }

}

export const storeDays = async (store_id: string, start_date?: string, end_date?: string) => {
    let storeBackups: Array<string> = await readDirectory(backupPath + `${store_id}/days/`);
    let storeDays: Array<number> = storeBackups.map(day => parseInt(day)).sort((a, b) => b - a).filter(date => date > parseInt(start_date) && date < parseInt(end_date));
    let endDayConvertedData: Array<EndDay> = [];
    for (const date of storeDays) {
        let fDate = new Date(date);
        console.log(date, fDate.toLocaleDateString('tr-Tr'), fDate.toLocaleTimeString('tr-Tr'))
        try {
            let backupData = await StoreReport(store_id, (date - 10).toString(), (date + 10).toString());
            let salesReport = StoreSalesReport(backupData.find(data => data.database = 'closed_checks').docs);
            let endDayObj: any = {
                total_income: (salesReport.cash + salesReport.card + salesReport.coupon),
                canceled_total: salesReport.canceled,
                card_total: salesReport.card,
                cash_total: salesReport.cash,
                check_count: salesReport.checks,
                coupon_total: salesReport.coupon,
                data_file: date.toString(),
                discount_total: salesReport.discount,
                free_total: salesReport.free,
                incomes: 0,
                outcomes: 0,
                owner: '51819909-9461-4f15-b65e-cc6f903c0de1',
                timestamp: date - 39_600_000,
                customers: salesReport.customers,
                db_name: 'endday',
                db_seq: 0
            }
            endDayConvertedData = endDayConvertedData.filter(obj => obj.total_income !== 0);
            endDayConvertedData = endDayConvertedData.filter(obj => obj.total_income !== 11090);
       
            if(!endDayConvertedData.includes(endDayObj)){
                endDayConvertedData.push(endDayObj);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // let test = (await StoreDB(store_id)).bulkDocs(endDayConvertedData);

    writeJsonFile('enddays.json',endDayConvertedData);


    // makePdf(store_id, parseInt(start_date), parseInt(end_date), endDayConvertedData)
}

export const updateStoreDetail = () => {

    ManagementDB.Stores.get('9bc2c532-634e-433e-ba97-224fdf4fa0d5').then((store: Store) => {
        store.settings.accesibilty.wifi = { ssid: 'Kallavi', password: 'kallavikervansaray' };
        console.log(store.slug);
        store.slug = 'kallavi-besiktas'
        store.phone_number = '2122361900';
        // store.settings.accesibilty.days = [
        //     {
        //         is_open: true,
        //         opening: '20:00',
        //         closing: '00:00'
        //     },
        //     {
        //         is_open: true,
        //         opening: '20:00',
        //         closing: '00:00'
        //     },
        //     {
        //         is_open: true,
        //         opening: '20:00',
        //         closing: '00:00'
        //     },
        //     {
        //         is_open: true,
        //         opening: '20:00',
        //         closing: '00:00'
        //     },
        //     {
        //         is_open: true,
        //         opening: '20:00',
        //         closing: '00:00'
        //     },
        //     {
        //         is_open: true,
        //         opening: '20:00',
        //         closing: '00:00'
        //     },
        //     {
        //         is_open: true,
        //         opening: '20:00',
        //         closing: '00:00'
        //     }]
        ManagementDB.Stores.put(store).then(isOK => {
            console.log(isOK.ok);
        })
    }).catch(err => {
        console.log(err);
    })

}

export const createInvoiceForStore = async () => {
    try {
        let token = await fatura.getToken(eFaturaUserName, eFaturaSecret)
        const faturaHTML = await fatura.createDraftInvoice(
            token,
            {
                date: "05/11/2021",
                time: "11:51:30",
                taxIDOrTRID: "28150785028",
                taxOffice: "Beyoğlu",
                title: "",
                name: "Tevfik Akın",
                surname: "Timur",
                fullAddress: "Kemankeş Karamustafa Paşa Mah. Baş Cerrah Sok. No:4/A Beyoğlu - İstanbul",
                items: [
                    {
                        name: "Dijital Menü Hizmeti",
                        quantity: 1,
                        unitPrice: 850,
                        price: 850,
                        VATRate: 18,
                        VATAmount: 153
                    }
                ],
                totalVAT: 153,
                grandTotal: 850.0,
                grandTotalInclVAT: 1003.0,
                paymentTotal: 1003.0
            },
            // Varsayılan olarak sign: true gönderilir.
            // { sign: true }
        )

        console.log(faturaHTML);
    } catch (err) {
        console.log(err);
    }
}

export const customerCredits = async (store_id: string) => {
    try {
        const StoreDatabase = await StoreDB(store_id);
        const Customers: Customer[] = (await StoreDatabase.find({ selector: { db_name: 'customers' }, limit: 2000 })).docs;
        const CustomersChecks: Array<Check> = (await StoreDatabase.find({ selector: { db_name: 'credits' }, limit: 2000 })).docs;
        console.log(Customers.length);
        console.log(CustomersChecks.length);
    } catch (error) {
        console.log(error);
    }
}

export const makeProforma = () => {
    proformaGenerator();
}

export const TAPDKCheck = (tapdkno: string) => {
    fetch("http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "upgrade-insecure-requests": "1",
            "cookie": "ASP.NET_SessionId=r3p134fzvhxef2ky4iu4agh3",
            "Referer": "http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `__EVENTTARGET=&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwULLTEwNTEyOTI4MDQPFgQeD0N1cnJlbnRQYWdlRGF0YQIBHg5RdWVyeWZvclNlYXJjaAWgAXNlbGVjdCBST1dfTlVNQkVSKCkgT1ZFUiAoT1JERVIgQlkgSUQgQVNDKSBBUyBSb3cgLCAqIGZyb20gVmlld19WaWV3QXBwX1JlcG9ydDAyICBXaGVyZSBTaWNpbF9ObyBMSUtFICcwMTAxMDU2NVBUJScgQU5EIENPTlZFUlQoSU5ULFNVQlNUUklORyhTaWNpbF9ObywxLDIpKTw5OSAWAgIDD2QWBAIBD2QWAmYPZBYKAgEPZBYEAgEPEA8WAh4LXyFEYXRhQm91bmRnZBAVUghTZcOnaW5pegVBREFOQQhBRElZQU1BTg9BRllPTktBUkFIxLBTQVIFQcSeUkkGQU1BU1lBBkFOS0FSQQdBTlRBTFlBB0FSVFbEsE4FQVlESU4KQkFMSUtFU8SwUglCxLBMRUPEsEsIQsSwTkfDlkwIQsSwVEzEsFMEQk9MVQZCVVJEVVIFQlVSU0EKw4dBTkFLS0FMRQjDh0FOS0lSSQbDh09SVU0JREVOxLBaTMSwC0TEsFlBUkJBS0lSB0VExLBSTkUHRUxBWknEnglFUlrEsE5DQU4HRVJaVVJVTQxFU0vEsMWeRUjEsFIKR0FaxLBBTlRFUAhHxLBSRVNVTgxHw5xNw5zFnkhBTkUISEFLS0FSxLAFSEFUQVkHSVNQQVJUQQdNRVJTxLBOCcSwU1RBTkJVTAfEsFpNxLBSBEtBUlMJS0FTVEFNT05VCEtBWVNFUsSwC0tJUktMQVJFTMSwCktJUsWeRUjEsFIIS09DQUVMxLAFS09OWUEIS8OcVEFIWUEHTUFMQVRZQQdNQU7EsFNBCEsuTUFSQcWeB01BUkTEsE4GTVXEnkxBBE1VxZ4KTkVWxZ5FSMSwUgdOxLDEnkRFBE9SRFUFUsSwWkUHU0FLQVJZQQZTQU1TVU4HU8SwxLBSVAZTxLBOT1AGU8SwVkFTClRFS8SwUkRBxJ4FVE9LQVQHVFJBQlpPTghUVU5DRUzEsArFnkFOTElVUkZBBVXFnkFLA1ZBTgZZT1pHQVQJWk9OR1VMREFLB0FLU0FSQVkHQkFZQlVSVAdLQVJBTUFOCUtJUklLS0FMRQZCQVRNQU4HxZ5JUk5BSwZCQVJUSU4HQVJEQUhBTgZJxJ5ESVIGWUFMT1ZBCEtBUkFCw5xLB0vEsEzEsFMJT1NNQU7EsFlFBkTDnFpDRRVSATABMQEyATMBNAE1ATYBNwE4ATkCMTACMTECMTICMTMCMTQCMTUCMTYCMTcCMTgCMTkCMjACMjECMjICMjMCMjQCMjUCMjYCMjcCMjgCMjkCMzACMzECMzICMzMCMzQCMzUCMzYCMzcCMzgCMzkCNDACNDECNDICNDMCNDQCNDUCNDYCNDcCNDgCNDkCNTACNTECNTICNTMCNTQCNTUCNTYCNTcCNTgCNTkCNjACNjECNjICNjMCNjQCNjUCNjYCNjcCNjgCNjkCNzACNzECNzICNzMCNzQCNzUCNzYCNzcCNzgCNzkCODACODEUKwNSZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZxYBZmQCAw8QDxYCHwJnZBAVAQhTZcOnaW5pehUBATAUKwMBZ2RkAgkPEA8WAh4HVmlzaWJsZWdkZBYBZmQCCw88KwARAwAPFgQfAmceC18hSXRlbUNvdW50AgFkARAWAgICAgYWAjwrAAUBABYCHgpIZWFkZXJUZXh0BQbEsEzDh0U8KwAFAQAWAh8FBRhTQVRJxZ4gWUVSxLBOxLBOIMOcTlZBTkkWAmZmDBQrAAAWAmYPZBYEAgEPZBYUZg8PFgIeBFRleHQFATFkZAIBDw8WAh8GBQVBREFOQWRkAgIPDxYCHwYFBlNFWUhBTmRkAgMPZBYCAgEPDxYCHwYFCjAxMDEwNTY1UFRkZAIEDw8WAh8GBQfFnkVNU8SwZGQCBQ8PFgIfBgUFQUxUSU5kZAIGDw8WAh8GBQZCQUtLQUxkZAIHDw8WAh8GBQZCQUtLQUxkZAIIDw8WAh8GBSFNxLBUSEFUUEHFnkEgTUggNTgyMDAgU09LLk5POjExL0FkZAIJDw8WAh8GBQRGQUFMZGQCAg8PFgIfA2hkZAIND2QWAmYPZBYEZg9kFhwCAQ8PFgIfA2hkZAIDDw8WAh8DaGRkAgUPDxYCHwNoZGQCBw8PFgIfA2hkZAIJDw8WAh8DaGRkAgsPDxYCHwNoZGQCDQ8PFgIfA2hkZAIPDw8WAh8DaGRkAhEPDxYCHwNoZGQCEw8PFgIfA2hkZAIVDw8WAh8DaGRkAhcPDxYCHwNoZGQCGQ8PFgIfA2hkZAIbDw8WAh8DaGRkAgEPZBYCAgEPDxYCHwYFFEzEsFNURURFIFRPUExBTSAgOiAxZGQCDw8PFgIfA2dkZAIFDw9kDxAWAWYWARYCHg5QYXJhbWV0ZXJWYWx1ZQUBMBYBZmRkGAMFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYFBQ1CdXR0b25fU2VhcmNoBRBCdXR0b25fQ2xlYXJGb3JtBQ5CdXR0b25fR29Tb3JndQUPQnV0dG9uX0dvU29yZ3UyBQxCdXR0b25fUHJpbnQFCk11bHRpVmlldzEPD2RmZAUJR3JpZFZpZXcxDzwrAAwBCAIBZDnbkHFnlhobqjnQ0on7C6R%2BVtZ1%2FcrlJCD6bDwhnQQl&__VIEWSTATEGENERATOR=8E9C732A&__EVENTVALIDATION=%2FwEdAHh4mX9dMAs36N%2FqQ3Eu6YJfbWFZL5UKCljsPGnrU%2BqNjJHtctNbVfC9D0kaXTfZK0Iy4TVOBg%2FztRH1Q9DD3BN1ubqyEMS2dyiIsLCoBQC5nyxSdDFryRIv06%2FclkglGGvXxPE4BNT2KEIXfPsgPfeZRz2gixF2734plCuEcKA5dUxLYXn7Lc6LdRUYBh9w%2F9wicrGZhUouCld3VQNMp%2BbJ8yXoxjlcrZiCBuANNI9b7fvhq5i56PSfRcB7DymwoNv%2FFLYPDRy3XnBJ6ZLbWHNHZpP%2BgE%2Bkayf36dXd7jDvdguO3YHabs5nuPco1HvHVjyEYQK0G71qNiz6pbXNNYEI2MS8vbGlsxkFs8VYgrWjZUtUQcKlHN0uhH0HMVVmH94U2Np5L4ucVzrle0scGv01eMVAwgsUmMW3wvdVmSJjL%2BDJRAhQxY9fCqZxh3gTdCICunO%2FNi0FkNrmAIGy0mL8S%2FJS6RVbWsDPMJdG6Bc%2FXyq5H6EHmVBZ3wVHycz3SnZfasmAQ3Zj3pIKi8Rh4yk5QpxYvdjKthTN6fGW5I5T28bGH7ZoRVEnhj8WTRPpbwlVd%2B%2FbjaZIdvll8NVqJpXWInfqGRS%2Fgt3C0RQl3Qr3SYlWVfbDM1RQv1XLK9hbmLFRkTJHvHOZ7HpRsoeS0I7aYykmIhgxZulvEdVu8kHaeYug0u0VVkAdsXWDyMZOCBRstvNdzlkMH88%2BW2iY2OCXbzPnXr6DG9S0VLACDnns04ctR30sdQc93hx7jJJm3dQQh22u7ga7XTMs1F58Nfxn1L%2FLByHdz3THBGLjwX2SOkwNrTeI8eqV71VhYm96KD%2F3XMoFk7LqhuRMbgEJKZdvw924%2FznZY0EDx%2BMPDbdiVGTDLZJoMluIt1ylGEszWVBX0UKFqkrjm0HK3%2BX17J7vvHpXkwWGnCZMh8PtxG503whGGvSN%2F5WUZW6uPbnZ%2B%2Fu0wWald%2BMA6g5NdKwb%2B%2BUkstmXTM3VUcgAzt5bDuPFantNL%2BQDgz%2B6ZG6Pr4pLcDIIXJ%2FCIcye%2Fai0PGP0KwzTvN9deHTBpPuwkRfuelD2KuIs%2BsCTbPQudM4NiISSGpN8EjoviaMs29guSqbmP0198Uj3OD4pKYraaJiQrf%2B3XyQtQJfIOQBLzrUf7CVV42n3FX94cqOI2P9xBmn0l98oV5W9iQ9DPX%2FWqKhyHeyWKvMOTzZcirQQHzhK3CxMelkyUwbCcgOVV9wPA0oM9FDZNMRLTLR4zL%2BOMrcfZJg2DU5GAToXmz8iIYz%2BOj7MvNS3Z5we7q4d%2F7v6ckEkCUSo4SOOsWeS5Hv0WEfss2wvpmpdiMpMYYfgvj1HObK303%2BP8TDZ0pOe4CLQ6tJpl0sEzjXex%2BIKeN9m3Lm8IfM0g6A1DKBRcaCVPHvIyrBXpOUWHnUfpj%2FT6nnvILauHv4q4KvAmOmzPleI1hb5Y4gTQEpQp9SjYi1%2B1yQanv2IVHXsGpRjUxrZEEZ%2FGAzgQVuxHyUIyp%2BE2J%2B6zGG6C4I9Pk%2BmEdRbOTJOIUKLhSp%2B0xdxpryPoSH%2Fwy0mmyi4LaJDI23BROFYlidjrii9PGjOZMQPNfl7ZNXp7%2BiNGHTNb%2ByOBobvK%2BlkLkEPkDNhPX%2FwsvgKgKGKlUPdQJ2wNVzyXZ0sIs7hb%2BGc0wfNtyBfnyv%2FbAZ%2FiFLO62XrDAjD7gqIVVf%2B%2B393ZWiquIRcm5u%2BT3UeELZVlNkVSewDzsVBxEVPtHy7zSBbmKD%2Bkt1NAzBE4ZkmA7gbEhG0dWYDGDx68pdpNgpMJdpe3YTppqgPEape%2BbJqsL6Q3PEGTk58SZMKjb9rYC2OneO0etge%2BJZsjMJ%2BXtKrV1%2B0J8XFpkc5LxMJcxpcQMX7Lb0oJQr6FEqEheWzIqA6TaxjQ1yvAC06yTip9yrp4lBdeZbPT3teUtMO%2FSisnJdN8IWMp%2FquzZ6S4vfl9c3rk59JnxVNMhEEm0hsD9y6zcwOpv5YgG69IfRuuVDfgveo%2BiEhkwfEkKU5g1RA9FB5XlbnfPzZHZ4TjIMQe8xW5jTwirGQycLOpS89t3Ko6xYde08ZMxGEFeAu7Kk4EJLJ1Bc7qH5popFLz8uGTx4sEYMmtQOmvA4J1LHOZ%2FHeRWUsblbxYz3w9fN6G6fIULktwyKM2oSGimdgFUWQmS%2Fc8ctbZ%2B5gIR8MeGe2ZdRbJYAZt5wE2ffMM%2FyhapmOnnDj%2BaZCBQFdztW0ho4LZAofyI%2FYCfCHT65Amja1dkTTHjj%2B%2FiEnVqDDCUe%2FBxKlNg1lNaxtMq4HswFx4PB6h0hf5vQib2AQ%2F%2Fy1yGjHRGCGUtuoEdGzSwMcT7Wb4%2Fd%2FFBoyKpj2JNW9CAHWntDhoKeIzNpoL7rcPrYuoJE3Xgh0JuUTgrY5ysjrQqK2PoVS1LgKds69zqq4X08%2B1oasDkwwGwyS6dMmZ5a70P7ce5cSIl7Ev7etQLPfNc9H%2BlZXXfUo8RbY%2FGkeclQN%2BCzp8VVq5lj%2FvAiVRxXlflrEEVSgoxBTQmDHgqpd4xxfsPZVpTv03pyiUKXbHWmfoCwDtY%2F%2FD9GA77M9R%2BbHWUGQ8CtejxT8cpx69jTTeUjfa9h0AVMP7zAExb%2FcEafUXQ%3D%3D&dd_il=0&dd_ilce=0&TXT_SICIL=${tapdkno}&TXT_TCK=&TXT_UNVAN=&TXT_ADRES=&TXT_vergino=&TXT_AD=&TXT_SOYAD=&TXT_TEL=&dd_tarih=0&dd_islem=-1&Button_Search.x=31&Button_Search.y=9&DropDownList_CountViewGrid=10`,
        "method": "POST"
    }).then(res => {
        res.text().then(html => {
            let regexp = new RegExp('Satıcı Bulunamadı.', 'i');
            if (html.search(regexp) == -1) {
                let root = parse(html);
                let table = root.querySelector('#GridView1');
                let data = {
                    company:table.querySelector('td:nth-child(7)').childNodes[0].innerText,
                    city:table.querySelector('td:nth-child(2)').childNodes[0].innerText,
                    district:table.querySelector('td:nth-child(3)').childNodes[0].innerText,
                    address:table.querySelector('td:nth-child(9)').childNodes[0].innerText,
                    type:table.querySelector('td:nth-child(8)').childNodes[0].innerText,
                    status:table.querySelector('td:nth-child(10)').childNodes[0].innerText
                } 
                if(data.status == 'FAAL'){
                    console.log({ ok: true, message: 'TAPDK Numarası FAAL' ,details:data })
                }else{
                    console.log({ ok: false, message: 'TAPDK Numarası ' + data.status })
                }
            } else {
                console.log({ ok: true, message: 'TAPDK Numarası Yanlış ve Kayıtlı İşletme Yok' })
            }
        })
    })
}