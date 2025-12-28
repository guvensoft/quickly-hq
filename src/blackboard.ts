import { mkdir, mkdirSync, readFile } from 'fs';
import { parse } from 'node-html-parser';
import path from 'path';
import { CouchDB, DatabaseQueryLimit, ManagementDB, MenuDB, RemoteDB, StoreDB, StoresDB } from './configrations/database';
import { BACKUP_PATH, DOCUMENTS_PATH } from './configrations/paths';
import { createIndexesForDatabase, createStoreDatabase, purgeDatabase } from './functions/management/database';
import { readDirectory, readJsonFile, writeJsonFile } from './functions/shared/files';
import { Database } from './models/management/database';
import { Store } from './models/management/store';
import { Cashbox } from './models/store/cashbox';
import { Check, CheckProduct, CheckType, ClosedCheck } from './models/store/check';
import { BackupData, EndDay } from './models/store/endoftheday';
import { Log } from './models/store/log';
import { Report, reportType } from './models/store/report';
import { Stock } from './models/store/stocks';
import Queue from "queue-promise";

import fetch from 'node-fetch';

import XLSX from 'xlsx';
import { OptionsV2, Parser, processors } from 'xml2js';
import { Table, TableStatus } from './models/store/table';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { productToStock } from './functions/store/stocks';
import { Menu, MenuStatus, Order } from './models/store/menu';
import { Category, Product, ProductSpecs, SubCategory } from './models/store/product';

import { createReport, ProductsReport, StoreReport, StoreSalesReport } from './functions/store/reports';

import fatura from 'fatura';
import { performance } from 'perf_hooks';
import { parseBooleans, parseNumbers } from 'xml2js/lib/processors';
import { eFaturaSecret, eFaturaUserName } from './configrations/secrets';
import { UBL } from './models/external/ubl';
import { Company, CompanyStatus, CompanyType } from './models/management/company';
import { Invoice, InvoiceItem, InvoiceStatus, InvoiceType } from './models/management/invoice';
import { Customer } from './models/store/customer';
import { BoldFont, NormalFont } from './utils/blobs';

import * as soap from "soap";
import * as isnet from './integration/isnet';
import * as uyumsoft from './integration/uyumsoft';

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
    console.log('table Fix startted')
    try {
        let db: Database = (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
        // let checks: Array<Check> | any = (await RemoteDB(db, db_name).find({ selector: { db_name: 'checks', type: CheckType.NORMAL }, limit: DatabaseQueryLimit })).docs;
        let tables: Array<Table> | any = (await RemoteDB(db, db_name).find({ selector: { db_name: 'tables' }, limit: DatabaseQueryLimit })).docs;
        // let products: Array<Product> | any = (await RemoteDB(db, db_name).find({ selector: { db_name: 'products' }, limit: DatabaseQueryLimit })).docs;
    
        console.log(tables.length);
        tables.forEach(async (table: Table) => {
            console.log(table)
            try {
                // let isEverythingNormal = checks.includes(obj => obj.table_id == table._id);
                // if (!isEverythingNormal) {
                    table.status = 1;
                    table.timestamp = Date.now();
                    let isUpdated = await RemoteDB(db, db_name).put(table);
                    console.log(isUpdated);
                // }
            } catch (error) {
                console.log(error);
            }
        });

    } catch (error) {
        console.log(error);
    }




    // checks.forEach(async (check: Check) => {
    //     try {
    //         let tableWillFix: Table = await RemoteDB(db, db_name).get(check.table_id);
    //         tableWillFix.status = 2;
    //         tableWillFix.timestamp = check.products.pop().timestamp;
    //         let isUpdated = await RemoteDB(db, db_name).put(tableWillFix);
    //         console.log(isUpdated);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // });

    // for (const product of products) {
    //     console.log(product.name);
    //     let isUpdated = await RemoteDB(db, db_name).put(product);
    //     console.log(isUpdated);
    // }




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
            let databasesWillFix = ['closed_checks', 'checks', 'logs', 'cashbox', 'orders', 'receipts']; // 'checks', 'logs', 'cashbox', 'orders', 'receipts'
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
                    let dayThat = 1655228516464;

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
    readJsonFile(BACKUP_PATH + 'db.dat').then((res: Array<any>) => {
        let enddays: Array<EndDay> = res.filter(obj => obj.db_name == 'endday').sort((a, b) => b.timestamp - a.timestamp).filter(obj => new Date(obj.timestamp).getDay() == 4);
        let categories = res.filter(obj => obj.db_name == 'categories');
        let sub_categories = res.filter(obj => obj.db_name == 'sub_categories');

        let balanced = 0;
        let checks_balanced = 0;
        enddays.forEach(day => {
            readJsonFile(BACKUP_PATH + 'backup/' + day.data_file).then((data: Array<BackupData>) => {

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

    readJsonFile(BACKUP_PATH + store_id + '/days/' + day_file).then((data: Array<BackupData>) => {

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

export const allOrders = async (db_name: string, check_id: string) => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' }, limit: 5000 }).then((res: any) => {
        const db: Database = res.docs[0];
        RemoteDB(db, db_name).get(check_id).then(check => {
            console.log(check.total_price);
        })
        RemoteDB(db, db_name).find({ selector: { db_name: 'orders', check: check_id } }).then(res => {

            let orders: Order[] = res.docs.sort((a, b) => b.timestamp - a.timestamp);
            let tableData = []
            // orders.map(order => order.items )
            orders.forEach(order => {
                // console.log(); 
                tableData = tableData.concat(order.items)
            });
            console.table(tableData);
            console.log('Toplam:        ', tableData.map(data => data.price).reduce((a, b) => a + b, 0));

        }).catch(err => {
            console.log('-------------------------------------')
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
            console.log(res);
            res._revs_info.filter(rev => rev.status == "available").forEach((obj, index) => {
                console.log(obj);
                RemoteDB(db, db_name).get(doc_id, { rev: obj.rev }).then((doc: any) => {
                    console.log(doc)
                    writeJsonFile('data' + index, res)
                });
            })
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    })
}

export const deletedStoreDocs = async (store_id: string, deletedDocsIds?: Array<string>) => {
    try {
        const db = await StoreDB(store_id);
        if (deletedDocsIds) {
            console.log(deletedDocsIds.length, ' Deleted Documents!')
            // Promise.all(deletedDocsIds.map(id => db.get(id, { revs: true, open_revs: 'all' }).then(doc => {
            //     console.log(doc);
            //     const revs = (doc[0].ok as any)._revisions;
            //     const lastRev = (revs.start - 1) + '-' + revs.ids[1];
            //     db.get(id, { rev: lastRev }).then(isDocAvailable => {
            //         console.log(isDocAvailable);
            //     }).catch(err => {
            //         console.log(err);
            //     })
            // }).catch(err => {
            //     console.log(err);
            // })
            // )).catch(err => {
            //     console.log(err);
            // });
        } else {
            const docs: string[] = [];
            db.changes({ filter: d => d._deleted })
                .on('change', c => {
                    console.log(c.id);
                    docs.push(c.id)
                })
                .on('error', e => console.log(e))
                .on('complete', () => {

                    docs.forEach(doc_id => {
                        db.get(doc_id, { revs_info: true }).then(res => {
                            console.log(res);
                            res._revs_info.filter(rev => rev.status == "available").forEach((obj, index) => {
                                console.log(obj);
                                // db.get(doc_id, { rev: obj.rev }).then((doc: any) => {
                                //     console.log(doc)
                                //     // writeJsonFile('data' + index + '.json', res)
                                // });
                            })
                        }).catch(err => {
                            console.log(err);
                        });
                    })

                    // console.log(docs.length, ' Deleted Documents found!')
                    // Promise.all(docs.map(id => db.get(id, { revs: true, open_revs: 'all' }).then(doc => {
                    //     console.log(doc);
                    //     const revs = (doc[0].ok as any)._revisions;
                    //     const lastRev = (revs.start - 1) + '-' + revs.ids[1];
                    //     db.get(id, { rev: lastRev }).then(isDocAvailable => {
                    //         console.log(isDocAvailable);
                    //     }).catch(err => {
                    //         console.log(err);
                    //     })
                    // }).catch(err => {
                    //     console.log(err);
                    // })
                    // )).catch(err => {
                    //     console.log(err);
                    // });
                });
        }
    } catch (error) {
        console.log(error);
    }
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

export const invoiceReader = (store_id: string, invoice_id?: string) => {
    const parserOpts: OptionsV2 = { ignoreAttrs: true, explicitArray: false, tagNameProcessors: [processors.stripPrefix], valueProcessors: [parseNumbers, parseBooleans] };
    const xmlParser = new Parser(parserOpts);

    readDirectory(path.join(__dirname, '../', '/backup/' + store_id + '/invoices/')).then(invoices => {
        let total = 0;

        invoices.forEach(invoice => {
            const invoicePath = path.join(__dirname, '../', '/backup/' + store_id + '/invoices/' + invoice);
            readFile(invoicePath, (err, buffer) => {
                if (!err) {
                    let data = buffer.toString('utf8');
                    xmlParser.parseStringPromise(data).then((ubl: UBL) => {

                        const UBL = ubl.Invoice;

                        let fromCompany: Company = {
                            name: UBL.AccountingSupplierParty.Party.PartyName.Name,
                            tax_no: (UBL.AccountingSupplierParty.Party.PartyIdentification.ID || UBL.AccountingSupplierParty.Party.PartyIdentification[0].ID),
                            tax_administration: UBL.AccountingSupplierParty.Party.PartyTaxScheme.TaxScheme.Name,
                            address: {
                                country: UBL.AccountingSupplierParty.Party.PostalAddress.Country.Name,
                                state: UBL.AccountingSupplierParty.Party.PostalAddress.District,
                                province: UBL.AccountingSupplierParty.Party.PostalAddress.CityName,
                                district: UBL.AccountingSupplierParty.Party.PostalAddress.CitySubdivisionName,
                                street: UBL.AccountingSupplierParty.Party.PostalAddress.StreetName,
                                description: (UBL.AccountingSupplierParty.Party.PostalAddress.StreetName + ' ' + UBL.AccountingSupplierParty.Party.PostalAddress.PostalZone + ', ' + UBL.AccountingSupplierParty.Party.PostalAddress.CitySubdivisionName + '/' + UBL.AccountingSupplierParty.Party.PostalAddress.CityName + ', ' + UBL.AccountingSupplierParty.Party.PostalAddress.Country.Name).replace('undefined', '').replace('undefined', ' ').replace('undefined', ' '),
                                cordinates: null
                            },
                            email: UBL.AccountingSupplierParty.Party.Contact?.ElectronicMail,
                            phone_number: UBL.AccountingSupplierParty.Party.Contact?.Telephone,
                            type: CompanyType.ANONYMOUS,
                            status: CompanyStatus.ACTIVE,
                            supervisor: null,
                            timestamp: Date.now(),
                            website: UBL.AccountingSupplierParty.Party?.WebsiteURI,
                        }
                        let toCompany: Company = {
                            name: UBL.AccountingCustomerParty.Party.PartyName.Name,
                            tax_no: (UBL.AccountingCustomerParty.Party.PartyIdentification.ID || UBL.AccountingCustomerParty.Party.PartyIdentification[0].ID),
                            tax_administration: UBL.AccountingCustomerParty.Party?.PartyTaxScheme?.TaxScheme.Name,
                            address: {
                                country: UBL.AccountingCustomerParty.Party.PostalAddress.Country.Name,
                                state: UBL.AccountingCustomerParty.Party.PostalAddress.District,
                                province: UBL.AccountingCustomerParty.Party.PostalAddress.CityName,
                                district: UBL.AccountingCustomerParty.Party.PostalAddress.CitySubdivisionName,
                                street: UBL.AccountingCustomerParty.Party.PostalAddress.StreetName,
                                description: (UBL.AccountingCustomerParty.Party.PostalAddress.StreetName + ' ' + UBL.AccountingCustomerParty.Party.PostalAddress.PostalZone + ', ' + UBL.AccountingCustomerParty.Party.PostalAddress.CitySubdivisionName + '/' + UBL.AccountingCustomerParty.Party.PostalAddress.CityName + ', ' + UBL.AccountingCustomerParty.Party.PostalAddress.Country.Name).replace('undefined', '').replace('undefined', ' ').replace('undefined', ' ').trim(),
                                cordinates: null
                            },
                            email: UBL.AccountingCustomerParty.Party.Contact?.ElectronicMail,
                            phone_number: UBL.AccountingCustomerParty.Party.Contact?.Telephone,
                            type: CompanyType.ANONYMOUS,
                            status: CompanyStatus.ACTIVE,
                            supervisor: null,
                            timestamp: Date.now(),
                            website: UBL.AccountingCustomerParty.Party?.WebsiteURI,
                        }
                        let Invoice: Invoice = {
                            store: store_id,
                            from: fromCompany,
                            to: toCompany,
                            items: [],
                            total: UBL.LegalMonetaryTotal.PayableAmount,
                            sub_total: UBL.LegalMonetaryTotal.TaxExclusiveAmount,
                            tax_total: UBL.TaxTotal.TaxAmount,
                            discount_total: (UBL?.AllowanceCharge?.Amount | 0),
                            installment: 1,
                            currency_rates: [],
                            status: InvoiceStatus.WAITING,
                            type: InvoiceType.SELLING,
                            timestamp: new Date(UBL.IssueDate + ' ' + UBL.IssueTime).getTime(),
                            expiry: new Date(UBL.IssueDate + ' ' + UBL.IssueTime).getTime() + 60 * 60 * 1000,
                            ettn: UBL.UUID,
                            inid: UBL.ID,
                            notes: UBL.Note.toString()
                        }

                        if (Array.isArray(UBL.InvoiceLine)) {

                            UBL.InvoiceLine.map(obj => {
                                let InvoiceItem: InvoiceItem = {
                                    name: obj.Item.Name,
                                    description: obj.Item?.Note,
                                    sku: obj.Item?.SellersItemIdentification?.ID,
                                    price: obj.Price.PriceAmount,
                                    quantity: obj.InvoicedQuantity,
                                    tax_value: obj.TaxTotal?.TaxSubtotal?.Percent,
                                    discount: (obj?.AllowanceCharge?.Amount | 0),
                                    currency: 'TRY',
                                    total_tax: obj.TaxTotal?.TaxAmount,
                                    total_price: obj.LineExtensionAmount
                                }
                                Invoice.items.push(InvoiceItem)
                            })
                        } else {
                            let obj: any = UBL.InvoiceLine;

                            let InvoiceItem: InvoiceItem = {
                                name: obj.Item.Name,
                                description: obj.Item?.Note,
                                sku: obj.Item?.SellersItemIdentification?.ID,
                                price: obj.Price.PriceAmount,
                                quantity: obj.InvoicedQuantity,
                                tax_value: obj.TaxTotal?.TaxSubtotal?.Percent,
                                discount: (obj?.AllowanceCharge?.Amount | 0),
                                currency: 'TRY',
                                total_tax: obj.TaxTotal?.TaxAmount,
                                total_price: obj.LineExtensionAmount
                            }
                            Invoice.items.push(InvoiceItem)
                        }




                        // StoresDB.Invoices.post(Invoice).then(isOk => {
                        //     console.log(isOk);
                        // }).catch(err => {
                        //     console.log(err);
                        // })

                        if (Invoice.inid == invoice_id) {
                            // console.log(UBL);
                            console.log(Invoice)

                            // let buff = Buffer.from(UBL.AdditionalDocumentReference.Attachment.EmbeddedDocumentBinaryObject);
                            // let decoded = buff.toString('utf-8');
                            // xmlParser.parseStringPromise(decoded).then(obj => { 
                            //     console.log(obj);

                            // })
                        }


                    }).catch(err => {
                        console.log('HATA 1', err);
                    })
                } else {
                    console.log('HATA 2', err);
                }
            });
        })

    }).catch(err => {
        console.log(err);
    });
}

export const invoiceViewer = (store_id: string, invoice_id?: string) => {
    const invoicePath = path.join(__dirname, '../', '/backup/' + store_id + '/invoices/' + invoice_id + '.xml');

    // readFile(invoicePath, (err,file) => {



    // })

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
            writeJsonFile(DOCUMENTS_PATH, 'harbi.json').then(res => {
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
    console.log('Importing Started !')
    let backupFile: Array<any> = await readJsonFile(BACKUP_PATH + `${store_id}/db.dat`);

    let docs = backupFile.filter(obj => obj.db_name == 'tables');

    docs.map(obj => {
        console.log(obj.name);
        obj.status = 1;
        delete obj._id;
        return obj;
    })

    console.log(docs.length);
    let bulkResponse = await (await StoreDB(store_id)).bulkDocs(docs);
    console.log(bulkResponse);
};


export const haoraFix = async () => {
    const Store: Store = await ManagementDB.Stores.get('22d9fc30-e497-48eb-a9e8-484ac50e5d57');
    const StoreDatabase = await StoreDB('22d9fc30-e497-48eb-a9e8-484ac50e5d57');
    let StoreChecks:Array<Check> = (await StoreDatabase.find({ selector: {db_name: 'checks' }, limit: 50000 })).docs;
    let StoreTables: Array<Table> =  (await StoreDatabase.find({ selector: {db_name: 'tables' }, limit: 50000 })).docs;

    StoreChecks.map(check => {
        // check.note = StoreTables.find(obj => obj._id == check.table_id).name;
        check.table_id = StoreTables.find(obj => obj.name == check.note)._id;

        StoreDatabase.upsert(check.table_id, (doc) => {
            doc.status = 2;
            return doc;
        }).then(isOK => {
            console.log(isOK);
        })
        // return check;
    });

    // StoreTables.map(obj => {
        
    // })

    // StoreDatabase.bulkDocs(StoreTables).then(isOK => {
    //     console.log(isOK);
    // }).catch(err => {
    //     console.log(err);
    // })

}

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
        writeJsonFile('db-backup', StoreDocuments).then(isOK => {
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
        }).catch(err => {

        })

    } catch (error) {
        console.log(error);
    }
}

export const backupStoreDatabase = async (store_id: string) => {
    try {
        let documents = (await (await StoreDB(store_id)).find({ selector: {}, limit: 100000 })).docs.filter(obj => obj.db_name !== 'logs' || obj.db_name !== 'orders' || obj.db_name !== 'prints',);
        // mkdirSync(BACKUP_PATH  + store_id)
        await writeJsonFile(BACKUP_PATH  + store_id + '/db.dat', documents);
        console.log('Fınıshed');
    } catch (error) {
        console.log(error)
    }
}

export const purgeStoreDatabase = (store_id: string) => {
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
        RemoteDB(db, 'mansion-cafe-restaurant-4b24').find({ selector: { db_name: 'products' }, limit: 2500 }).then((res: any) => {
            // return res.docs.filter(obj => obj.cat_id !== 'e4f2dd26-bd45-4151-abcb-d8fc0b89226a').map(object => {
            //     try {
            //         object.notes = 'Redbull,Cola,Soda,Sek,Portakal,Vişne,Elma,Buzlu,Buzsuz,Nane,Tonik';
            //     } catch (error) {
            //         console.log(object.name);
            //     }
            //     // console.log(object.name, object.position);
            //     return object;
            // });

            return res.docs.map(obj => {
                obj.extras = [];
                return obj;
            })
        }).then(products => {
            console.log(products[10]);
            RemoteDB(db, 'mansion-cafe-restaurant-4b24').bulkDocs(products).then(res => {
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

        PDF.setLanguage('tr')
        PDF.addFileToVFS("Normal.ttf", NormalFont);
        PDF.addFileToVFS("Bold.ttf", BoldFont);
        PDF.addFont("Normal.ttf", "Normal", "normal");
        PDF.addFont("Bold.ttf", "Bold", "bold");
        PDF.setFont("Normal");

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




        PDF.text(Store.name + ' - ' + ReportDate + ' Raporu', 40, 16.5, {});
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
                0: { fillColor: [43, 62, 80], textColor: 255, fontStyle: 'normal', font: 'Bold' },
                1: { fillColor: [28, 40, 48], textColor: 255, fontStyle: 'normal', font: 'Bold' },
                2: { fillColor: [28, 40, 48], textColor: [98, 173, 101], fontStyle: 'normal', font: 'Bold' },
                3: { fillColor: [28, 40, 48], textColor: [232, 167, 84], fontStyle: 'normal', font: 'Bold' },
                4: { fillColor: [28, 40, 48], textColor: [87, 184, 205], fontStyle: 'normal', font: 'Bold' },
                5: { fillColor: [28, 40, 48], textColor: [181, 91, 82], fontStyle: 'normal', font: 'Bold' },
                6: { fillColor: [28, 40, 48], textColor: [186, 109, 46], fontStyle: 'normal', font: 'Bold' },
                7: { fillColor: [28, 40, 48], textColor: 255, fontStyle: 'normal', font: 'Bold' },
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

export const findDuplicates = async (store_id: string) => {

    const StoreDatabase = await StoreDB(store_id);

    const checks = (await StoreDatabase.find({ selector: { db_name: 'checks' }, limit: 2000 })).docs;
    const closed_checks = (await StoreDatabase.find({ selector: { db_name: 'closed_checks' }, limit: 2000 })).docs;
    // const sub_categories = (await StoreDatabase.find({ selector: { db_name: 'sub_categories' }, limit: 2000 })).docs;
    // const reports = (await StoreDatabase.find({ selector: { db_name: 'reports', type: 'Product' }, limit: 2000 })).docs;

    let uniqDocs: ClosedCheck[] = [];
    let docsWillRemove = [];

    for (const check of closed_checks) {
        if (uniqDocs.some(obj => obj.timestamp == check.timestamp)) {
            docsWillRemove.push(check);
        } else {
            uniqDocs.push(check);
        }
    }


    console.log(docsWillRemove);

    // docsWillRemove.map(obj => obj._deleted = true);

    // let isRemoved = await StoreDatabase.bulkDocs(docsWillRemove);

    // console.log(isRemoved)

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

export const loadStoreBackup = async (store_id: string, db_name: string) => {
    try {
        const Store = await ManagementDB.Stores.get(store_id);
        const StoreDatabase = await StoreDB(store_id);
        let backup = await readJsonFile(BACKUP_PATH + `${store_id}/db.dat`);
        backup = backup.filter(obj => obj.db_name == db_name);
        console.log(backup.length);
        let storeTables = (await StoreDatabase.find({ selector: { db_name: db_name }, limit: DatabaseQueryLimit })).docs;
        backup.forEach(async element => {
            if (storeTables.find(obj => obj.name == element.name)) {
            } else {
                console.log(element.name);
                let isOk = await StoreDatabase.put(element);
                console.log(isOk);
            }
        });
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
        let StoreProducts: Array<Product> = (await StoreDatabase.find({ selector: { db_name: 'products' }, limit: DatabaseQueryLimit })).docs;
        let BulkUpdateDocs: Array<Product> = [];
        const Menu: Menu = await (await MenuDatabase.find({ selector: { store_id: store_id } })).docs[0];
        let selectedCategories = Menu.categories.filter(obj => obj.name == 'Biralar | Beers');
        selectedCategories.forEach((category, index) => {
            if (category.items.length > 0) {
                category.items.forEach(obj => {
                    let product = StoreProducts.find(product => product._id == obj.product_id);
                    if (product) {
                        // console.log(product.name);
                        product.price = obj.price;
                        if (obj?.options && obj?.options.length > 0) {
                            if (product?.specifies) {
                                product.specifies = [];
                                obj.options.forEach(opt => {
                                    product.specifies.push({ spec_name: opt.name, spec_price: opt.price });
                                })
                            } else {
                                product.specifies = [];
                                obj.options.forEach(opt => {
                                    product.specifies.push({ spec_name: opt.name, spec_price: opt.price });
                                })
                            }
                        } else {
                            product.specifies = [];
                        }
                        BulkUpdateDocs.push(product);
                    } else {
                        console.log('newProduct', obj.name, obj.price);
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
            if (category.item_groups.length > 0) {
                category.item_groups.forEach(sub_cat => {
                    if (sub_cat.items.length > 0) {
                        sub_cat.items.forEach(obj => {
                            let product = StoreProducts.find(product => product._id == obj.product_id);
                            if (product) {
                                product.price = obj.price;
                                if (obj?.options && obj?.options.length > 0) {
                                    if (product?.specifies) {
                                        product.specifies = [];
                                        obj.options.forEach(opt => {
                                            product.specifies.push({ spec_name: opt.name, spec_price: opt.price });
                                        })
                                    } else {
                                        product.specifies = [];
                                        obj.options.forEach(opt => {
                                            product.specifies.push({ spec_name: opt.name, spec_price: opt.price });
                                        })
                                    }
                                } else {
                                    product.specifies = [];
                                }
                                BulkUpdateDocs.push(product);
                            } else {
                                console.log('newProduct', obj.name, obj.price);
                                // if(obj?.options && obj?.options.length > 0){

                                // }
                            }
                        })
                    }
                });
            }
        })
        console.log(BulkUpdateDocs.length);
        let updateOps = await StoreDatabase.bulkDocs(BulkUpdateDocs);
        console.log(updateOps);
    } catch (error) {
        console.log(error);
    }
}

export const reportsTest = async (store_id: string) => {
    const t0 = performance.now();
    const Days: Array<EndDay> = (await (await StoreDB(store_id)).find({ selector: { db_name: 'endday' } })).docs.sort((a, b) => a.timestamp - b.timestamp);
    const BackupData: Array<BackupData> = await StoreReport(store_id, '1641938574500') // await StoreReport(store_id, Days[0].timestamp.toString(), Days[Days.length - 1].timestamp.toString());
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
                if(category.items.length > 0) {
                    category.items.map((product: any) => {
                        product.price = parseFloat(product.price)
                        if(product.options){
                            product.options.forEach(opt => {
                                opt.price = parseFloat(opt.price)
                            })
                        }
                    })
                }
                if(category.item_groups.length > 0){
                    category.item_groups.map(sub_cat => {
                        sub_cat.items.map((product: any) => {
                            product.price = parseFloat(product.price)
                            if(product.options){
                                product.options.forEach(opt => {
                                    opt.price = parseFloat(opt.price)
                                })
                            }
                        })
                    })
                }
            })
        })
        console.log(Menus);
        setTimeout(() => {
            MenuDatabase.bulkDocs(Menus).then(res => {
                console.log(res);
            })
        }, 5000)
    } catch (error) {
        console.log(error);
    }
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

export const quicklySellingData = async (year: number, month: number) => {
    const monthlyLabels = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const Stores = (await ManagementDB.Stores.find({ selector: {} })).docs;
    let Days = [];
    let Months = [];
    for (const store of Stores) {
        let storeEndDayData: Array<EndDay> = (await (await StoreDB(store._id)).find({ selector: { db_name: 'endday' }, limit: DatabaseQueryLimit })).docs
        let endDayData = storeEndDayData.filter(obj => new Date(obj.timestamp).getFullYear() == year && new Date(obj.timestamp).getMonth() == month);
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

export const clearDocuments = async (store_id: string, db_name: string) => {
    try {
        const StoreDatabase = await StoreDB(store_id);
        let Documents = await StoreDatabase.find({ selector: { db_name: db_name }, limit: 40000 })
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

export const productReports = async (store_id: string, start_date?: string, end_date?: string) => {
    console.log(new Date(parseInt(start_date)).toLocaleDateString())
    console.log(new Date(parseInt(end_date)).toLocaleDateString())
    try {
        let durationReports = await StoreReport(store_id, start_date, end_date);
        let checks = durationReports.find(obj => obj.database == 'closed_checks').docs;
        let cashbox = durationReports.find(obj => obj.database == 'cashbox').docs;
        let productReports = ProductsReport(checks);
        for (const iterator of productReports) {
        }
        let salesReport = StoreSalesReport(checks);
        console.log(productReports);
    } catch (error) {
        console.log(error);
    }

}

export const storeDays = async (store_id: string, start_date?: string, end_date?: string) => {
    let enddays = await (await (await StoreDB(store_id)).find({ selector: { db_name: 'endday' }, limit: 3000 })).docs;
    let storeBackups: Array<string> = await readDirectory(BACKUP_PATH + `${store_id}/days/`);
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
                owner: '24f25af0-db87-404b-a02f-abd0d13b8455',
                timestamp: date - 39_600_000,
                customers: salesReport.customers,
                db_name: 'endday',
                db_seq: 0
            }

            endDayConvertedData = endDayConvertedData.filter(obj => obj.total_income !== 0);
            // endDayConvertedData = endDayConvertedData.filter(obj => obj.total_income !== 11090);

            if (!endDayConvertedData.includes(endDayObj)) {
                endDayConvertedData.push(endDayObj);
            }

        } catch (error) {
            console.log(error);
        }
    }

    // let pushServer = (await StoreDB(store_id)).bulkDocs(endDayConvertedData);
    // pushServer.then(res => {
    //     console.log(res);
    // }).catch(err => {
    //     console.log(err);
    // })



    writeJsonFile('enddays', endDayConvertedData);

    makePdf(store_id, parseInt(start_date), parseInt(end_date), endDayConvertedData)
}

export const storeProductSales = async (store_id: string, start_date?: string, end_date?: string) => {
    try {
        const Store: Store = await ManagementDB.Stores.get(store_id)
        const MonthLabels = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasim", "Aralık"];
        const ReportDate = MonthLabels[new Date(parseInt(start_date)).getMonth()] + ' ' + new Date(parseInt(start_date)).getFullYear();

        let categories = (await (await StoreDB(store_id)).find({ selector: { db_name: 'categories' }, limit: DatabaseQueryLimit })).docs;
        let credits = (await (await StoreDB(store_id)).find({ selector: { db_name: 'credits' }, limit: DatabaseQueryLimit })).docs;

        let backupData = await StoreReport(store_id, start_date, end_date);

        let productsChecks = backupData.find(data => data.database = 'closed_checks').docs.concat(credits)
        let salesReport = ProductsReport(productsChecks);

        const transformPrice = (value: number): string => {
            if (!value) value = 0;
            return Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' TL'; /// ₺
        }
        const categoryName = (cat_id: string): string => {
            let category = categories.find(obj => obj._id == cat_id);
            if (category) {
                return category.name.toUpperCase();
            } else {
                return '';
            }
        }

        let tableBodyData = [];

        salesReport = salesReport.sort((a, b) => (b.count * b.price) - (a.count * a.price));
        salesReport.forEach((product, index) => {
            let data = [product.name.toUpperCase(), categoryName(product.category_id), transformPrice(product.price), product.count, transformPrice(product.total)];
            tableBodyData.push(data);
        });
        let tableHeadData = [['Ürün Adı', 'Kategori', 'Birim Fiyat', 'Satış Adedi', 'Toplam Satış']]

        const xlsxData = [].concat(tableHeadData, tableBodyData);
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(xlsxData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, ReportDate);

        XLSX.writeFile(wb, Store.name + '-' + ReportDate + '-Ürün Satış' + '.xlsx');

    } catch (error) {
        console.log(error);
    }
    // let tableFootData = [['Genel Toplam', totalProperty('total_income'), totalProperty('cash_total'), totalProperty('card_total'), totalProperty('coupon_total'), totalProperty('free_total'), totalProperty('canceled_total'), totalProperty('discount_total')]]
    //#region PDF
    // const PDF = new jsPDF({ orientation: "portrait" });
    // PDF.setLanguage('tr')
    // PDF.addFileToVFS("Normal.ttf", NormalFont);
    // PDF.addFileToVFS("Bold.ttf", BoldFont);
    // PDF.addFont("Normal.ttf", "Normal", "normal");
    // PDF.addFont("Bold.ttf", "Bold", "bold");
    // PDF.setFont("Normal");
    // PDF.text(Store.name + ' - ' + ReportDate + ' Raporu', 40, 16.5, {});
    // PDF.addImage(Store.logo, 'PNG', 5, 0, 30, 30);
    // autoTable(PDF, {
    //     startY: 30,
    //     styles: {
    //         // cellPadding: 5,
    //         // fontSize: 10,
    //         font: "helvetica", // helvetica, times, courier
    //         lineColor: 200,
    //         // lineWidth: 0.1,
    //         fontStyle: 'bold', // normal, bold, italic, bolditalic,
    //         overflow: 'ellipsize', // visible, hidden, ellipsize or linebreak
    //         // fillColor: 255,
    //         // textColor: 20,
    //         halign: 'right', // left, center, right
    //         valign: 'middle', // top, middle, bottom
    //         // fillStyle: 'F', // 'S', 'F' or 'DF' (stroke, fill or fill then stroke)
    //         // rowHeight: 20,
    //         // columnWidth: 'auto' // 'auto', 'wrap' or a number
    //     },
    //     head: tableHeadData,
    //     // foot: tableFootData,
    //     body: tableBodyData,
    //     theme: 'plain',
    //     margin: { vertical: 0, horizontal: 0 },
    //     headStyles: { halign: "center", fillColor: [43, 62, 80], textColor: 255 },
    //     footStyles: { halign: "right", minCellHeight: 10, fillColor: [255, 255, 255], textColor: 0 },
    //     // columnStyles: {
    //     //     0: { fillColor: [43, 62, 80], textColor: 255, fontStyle: 'normal', font: 'Bold' },
    //     //     1: { fillColor: [28, 40, 48], textColor: 255, fontStyle: 'normal', font: 'Bold' },
    //     //     2: { fillColor: [28, 40, 48], textColor: [98, 173, 101], fontStyle: 'normal', font: 'Bold' },
    //     //     3: { fillColor: [28, 40, 48], textColor: [232, 167, 84], fontStyle: 'normal', font: 'Bold' },
    //     //     4: { fillColor: [28, 40, 48], textColor: [87, 184, 205], fontStyle: 'normal', font: 'Bold' },
    //     //     5: { fillColor: [28, 40, 48], textColor: [181, 91, 82], fontStyle: 'normal', font: 'Bold' },
    //     //     6: { fillColor: [28, 40, 48], textColor: [186, 109, 46], fontStyle: 'normal', font: 'Bold' },
    //     //     7: { fillColor: [28, 40, 48], textColor: 255, fontStyle: 'normal', font: 'Bold' },
    //     // },
    // })
    // PDF.save(Store.name + '- Ürün Satış -' + ReportDate + '.pdf');
    //#endregion

}

export const storeProductExport = async (store_id: string) => {
    try {
        const Store: Store = await ManagementDB.Stores.get(store_id)

        let products: Product[] = (await (await StoreDB(store_id)).find({ selector: { db_name: 'products' }, limit: DatabaseQueryLimit })).docs;
        let categories = (await (await StoreDB(store_id)).find({ selector: { db_name: 'categories' }, limit: DatabaseQueryLimit })).docs;

        const transformPrice = (value: number): string => {
            if (!value) value = 0;
            return Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' TL'; /// ₺
        }
        const categoryName = (cat_id: string): string => {
            let category = categories.find(obj => obj._id == cat_id);
            if (category) {
                return category.name.toUpperCase();
            } else {
                return '';
            }
        }

        let tableBodyData = [];
        products.sort((a, b) => a.cat_id.localeCompare(b.cat_id));


        products.forEach((product, index) => {
            let data = [product.name.toUpperCase(), categoryName(product.cat_id), transformPrice(product.price)];
            tableBodyData.push(data);
        });
        let tableHeadData = [['Ürün Adı', 'Kategori', 'Birim Fiyat']]

        const xlsxData = [].concat(tableHeadData, tableBodyData);
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(xlsxData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws);

        XLSX.writeFile(wb, Store.name + '-Ürün Listesi' + '.xlsx');

    } catch (error) {
        console.log(error);
    }
}

export const updateStoreDetail = () => {
    ManagementDB.Stores.get('d622f9dd-036b-4775-bbee-911d301c5b77').then((store: Store) => {
        // store.settings.accesibilty.wifi = { ssid: 'Kallavi', password: 'kallavikervansaray' };
        // console.log(store.slug);
        // store.slug = 'timothys-cafe';
        // store.phone_number = '5336535668';
        store.auth = { database_id: 'ac1a0e21-1a04-421b-b295-418e4dca52e5', database_name: 'kosmos-besiktas', database_user: '$2b$10$78hdWumi3j4g0AMPt70HRe', database_password: '$2b$10$FZXSZbxf9uRJ9dttyA.40usCM1tLZXVEPIuna3edNAqF/.PYO1aRi' }
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

export const updateStoresDetails = () => {
    ManagementDB.Stores.find({ selector: {}, limit: DatabaseQueryLimit }).then((stores) => {
        const Stores = stores.docs.filter(store => store._id !== 'd622f9dd-036b-4775-bbee-911d301c5b77');
        Stores.forEach((store: Store) => {
            store.auth.database_id = 'ac1a0e21-1a04-421b-b295-418e4dca52e5';
            ManagementDB.Stores.put(store).then(isOK => {
                console.log(isOK.ok);
            });
        })
    }).catch(err => {
        console.log(err);
    })
}

export const recreateAllStoreDB = () => {
    ManagementDB.Stores.find({ selector: {}, limit: DatabaseQueryLimit }).then((stores) => {
        const Stores = stores.docs.filter(store => store._id !== 'd622f9dd-036b-4775-bbee-911d301c5b77');
        Stores.forEach((store: Store) => {
            recrateDatabase(store._id);
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
                    company: table.querySelector('td:nth-child(7)').childNodes[0].innerText,
                    city: table.querySelector('td:nth-child(2)').childNodes[0].innerText,
                    district: table.querySelector('td:nth-child(3)').childNodes[0].innerText,
                    address: table.querySelector('td:nth-child(9)').childNodes[0].innerText,
                    type: table.querySelector('td:nth-child(8)').childNodes[0].innerText,
                    status: table.querySelector('td:nth-child(10)').childNodes[0].innerText
                }
                if (data.status == 'FAAL') {
                    console.log({ ok: true, message: 'TAPDK Numarası FAAL', details: data })
                } else {
                    console.log({ ok: false, message: 'TAPDK Numarası ' + data.status })
                }
            } else {
                console.log({ ok: true, message: 'TAPDK Numarası Yanlış ve Kayıtlı İşletme Yok' })
            }
        })
    })
}

export const replaceProductsNameOfMenu = async (store_id: string) => {
    try {
        let kadeh = '🥃';
        let sise = '🍾';
        const StoreDatabase = await StoreDB(store_id);
        const Products: Product[] = (await StoreDatabase.find({ selector: { db_name: 'products' }, limit: 4000 })).docs;
        let UpdatedVersion = [];

        // let replacing = JSON.stringify(Products).replaceAll('🥃','Kadeh').replaceAll('🍾','Şişe');
        // let UpdatedProducts = JSON.parse(replacing);



        // for (const product of UpdatedProducts) {
        //     if(product.specifies.length > 0) {
        //         for (let spec of product.specifies) {
        //             console.log(spec.spec_name);
        //         }
        //         // UpdatedVersion.push(updatedProduct);
        //     }
        // }

        Products.forEach(product => {
            if (product.specifies.length > 0) {
                product.specifies.forEach(spec => {
                    if (spec.spec_name.includes(sise)) {
                        console.log(product)
                        spec.spec_name = spec.spec_name.replace(kadeh, 'Kadeh').replace(sise, 'Sise').replace('🍷', 'Kadeh');
                        console.log(spec.spec_name);
                        StoreDatabase.put(product).then(obj => {
                            console.log(obj);
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                    // spec.spec_name = spec.spec_name.replace(kadeh,'Kadeh').replace(sise,'Sise').replace('🍷','Kadeh');
                    // console.log(spec.spec_name);
                    // StoreDatabase.put(product).then(obj => {
                    //     console.log(obj);
                    // }).catch(err => {
                    //     console.log(err);
                    // })
                })
            }
        })

        // for (const product of Products) {
        //     let updatedProduct = product
        //     if(updatedProduct.specifies.length > 0) {
        //         for (let spec of updatedProduct.specifies) {
        //             spec.spec_name.replace(kadeh,'Kadeh').replace(sise,'Sise');
        //         }
        //         UpdatedVersion.push(updatedProduct);
        //     }
        // }
    } catch (error) {
        console.log(error);
    }
}

export const getStoresLogos = async () => {
    try {
        let stores = (await ManagementDB.Stores.allDocs({ include_docs: true })).rows;
        for (const store of stores) {
            var base64Data = store.doc.logo.replace(/^data:image\/png;base64,/, "");
            require("fs").writeFile('./slug/' + store.doc.slug + '.png', base64Data, 'base64', function (err) {
                console.log(err);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

export const uyumsoftInvoice = () => {

    const UYUMSOFT_WSDL_URL = "https://efatura-test.uyumsoft.com.tr/Services/Integration?wsdl";
    const UYUMSOFT_USERNAME = "Uyumsoft";
    const UYUMSOFT_PASSWORD = "Uyumsoft";

    function createSoapClient(wsdlUrl, username, password) {
        return new Promise((resolve, reject) => {
            soap.createClient(wsdlUrl, {}, (err, client) => {
                if (err) {
                    reject(err);
                    return;
                }

                const wsSecurity = new soap.WSSecurity(username, password);
                client.setSecurity(wsSecurity);
                resolve(client);
            });
        });
    }

    async function getInboxInvoices(client) {
        const { GetInboxInvoices } = client;
        const { result, envelope, soapHeader } = await GetInboxInvoices({
            query: {
                PageIndex: 0,
                PageSize: 20,
                ExecutionStartDate: null,
                ExecutionEndDate: null,
                //  InvoiceIds: [],
                //  InvoiceNumbers: [],
                SetTaken: false,
                OnlyNewestInvoices: false,
            },
        });

        if (result?.GetInboxInvoicesResult?.$attributes?.IsSucceded !== "true") {
            return undefined;
        }

        return result.GetInboxInvoicesResult.Value;
    }

    async function main() {
        console.log("Creating SOAP client...");
        const client = await createSoapClient(
            UYUMSOFT_WSDL_URL,
            UYUMSOFT_USERNAME,
            UYUMSOFT_PASSWORD
        );

        console.log(Object.keys(client));

        console.log("Fetching invoice list...");
        const invoiceList = await getInboxInvoices(client);
        if (invoiceList == null) {
            console.error("Invoice list cannot be fetched");
            return;
        }

        const invoiceSummaryList = invoiceList.Items.map((item) => {
            const {
                IssueDate,
                AccountingSupplierParty,
                AccountingCustomerParty,
                LegalMonetaryTotal: { PayableAmount },
            } = item.Invoice;

            return {
                "Issue Date": IssueDate,
                "Accounting Supplier Party": AccountingSupplierParty.Party.PartyName.Name,
                "Accounting Customer Party": AccountingCustomerParty.Party.PartyName.Name,
                Amount: `${PayableAmount.$value} ${PayableAmount.$attributes.currencyID}`,
            };
        });

        console.log("Invoices:");
        console.table(invoiceSummaryList);
        console.log("Done.");
    }

    main();
}

export const soapTEST = () => {
    fetch("https://nettefatura.isnet.net.tr/IncomingInvoice/AllIncomingInvoiceByFilter", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "_ga=GA1.3.1753555352.1666362530; Login=VknTckn=16867951058; cookieconsent_status=dismiss; _gid=GA1.3.1560305061.1667316988; NSC_wt_ofuufgbuvsb.jtofu.ofu.us=30dfa3db535567a582f5a6f1a29def41c1f46c1489d232caebb91c7edf5c05a9deb38c6c; __RequestVerificationToken=SZu54480yuqsMrQg3KI9rN0xYLeLNapzqp2NJQTXuRQzZU-38crNSyb1fFYdiXxz0HZ71rHWbA2V8h0asaWi1ilElRV_zYfm7-FYjL4gSGA1; ASP.NET_SessionId=ot3y502pr5tf1egjbomhpss5; .ASPXFORMSAUTH=610E171DB437B6F781386F3E080F1A4315A203E85D09D8D42AED3654055DB0119889E76104AF62A6ADB1E123271702839FCFAAA725F619D9FED56E120620A9E0AAAB5E48FE673290B4CC88FB796F2510374C5E1D5A94FC2AD7DBD83174AFBF650F0435476C856225B6BAA8E283CB21BAC2D0DCCCB21E2D83614C5A2375B2BF582F2D8FFF6D0C0B11541DB5E332238AEB3367C571035F10D4307FC105010D4AB54C028CEFE72D626796234F72C64B92A9526133E67B88389E2B5FC116BB6810EDAF5DFF2EA0B5924EF030DA141E30D62EF23CF739A6C4D9AFB1DB203F1640A727E5FD995962EDD867276FE08FB01EE83F876568182616F37175B4B532B91F79283B9C58F126913A97254A552332B0FB2AFE22489657BE09C5E6BE2032BC1EB38B40D3BD11D6B2E10656F9A144D6A86B7B8979F395A51F4A8BD9B25684BEDC3538375501C2BB17C54191CA5997474BA43EC94AF348B61B47BCD22BE3BF88BDE0E282203786029CCF1DCDB778DFAB98808FF941D8B52C298FF1850BA28D48186106D007FFE480E36F4683292A3353CD22C48BB43E47361BE25EDCCB798A33EFA3B4ED896A2AE9DD8E822EA1E7B59BA46E79CBFCF78293967ECDBABC2D3D4AE2D05752BD0004654610B0B38989CE4096D58C149A6D2612FBE7D853888653BAFBDA25C0CE03E08A25414E1661BCE0E3166F4D7162C61C8BDF14AB362094E1D53F65A3113ACED8E02FA2853D32B19AD7C51251910D5C06A07F3998309BCFA81A0BC3F106A2005555D359638132AD440D8A6E54C46693ACDA81834662FA38D5052A2CD7F70CCF0FD71FA065E5EBE10ADBA874DB4318400870E657EA5880B56B6A430D125E0ECC59916BBF4A5D1DB8218FFBE3D610E2031AB00DF078A0E3A3E391CA4116B2AE2656E44E83B879FE9C5E780C7E41E0C399B988C6F02EE2C9C87D1484D2157BA8A578FABF455A07BB3F31A69469BCF29EA96300555EA8A2014ED01BB4224D5999D19D11D8FFF3813F9150D9B421DA9404F49BD35918D6C74264620B1BE8CF046240F3307E82C6E77A36D1F038E91DA4C8F420CEB1E33F76C3171E801DAB990C5B180529024626930D8D603CEF47606C98CA1F56DC08BC89FFE7E735573F467D5C849FCB74AD19E22B3A7919511FBB37D7D3B39919D7805F1E573681AB4F5D2311C59AE35851B545F795341030A752A9D501D216DF636B9B9F02687203AD6495E77951BC1A4C829B758AC5862A16D2FDFA89031EF514EE73BF0D7265B73104A7D7A655BCAB28DE01F3158C3E0B7BEB3F7AB629E47C2DF1321F4F1D4857AE4F4EE1DB06F1C6C9C2CA8A2B622CA37621; citrix_ns_id=HQ5a+GWNqe3egBKNbulKSDi9sqA0002",
            "Referer": "https://nettefatura.isnet.net.tr/IncomingInvoice/IncomingInvoiceList",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "draw=3&columns%5B0%5D%5Bdata%5D=IdFaturaGelen&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=ActionButtons&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=AliciAdi&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=FaturaNo&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=Ettn&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=FaturaTarihiFormated&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=OdenecekTutarFormatted&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=GelisTarihiFormated&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=true&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=SenaryoAdi&columns%5B8%5D%5Bname%5D=&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=true&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=FaturaTipiAdi&columns%5B9%5D%5Bname%5D=&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=true&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B10%5D%5Bdata%5D=DurumAdi&columns%5B10%5D%5Bname%5D=&columns%5B10%5D%5Bsearchable%5D=true&columns%5B10%5D%5Borderable%5D=true&columns%5B10%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B10%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B11%5D%5Bdata%5D=OdemeSonucFormatted&columns%5B11%5D%5Bname%5D=&columns%5B11%5D%5Bsearchable%5D=true&columns%5B11%5D%5Borderable%5D=true&columns%5B11%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B11%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B12%5D%5Bdata%5D=IadeFaturaNo&columns%5B12%5D%5Bname%5D=&columns%5B12%5D%5Bsearchable%5D=true&columns%5B12%5D%5Borderable%5D=true&columns%5B12%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B12%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B13%5D%5Bdata%5D=IdFaturaGelenEk&columns%5B13%5D%5Bname%5D=&columns%5B13%5D%5Bsearchable%5D=true&columns%5B13%5D%5Borderable%5D=true&columns%5B13%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B13%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B14%5D%5Bdata%5D=14&columns%5B14%5D%5Bname%5D=&columns%5B14%5D%5Bsearchable%5D=true&columns%5B14%5D%5Borderable%5D=true&columns%5B14%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B14%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=7&order%5B0%5D%5Bdir%5D=desc&start=0&length=50&search%5Bvalue%5D=&search%5Bregex%5D=false&FaturaNo=&CompanyIdFilter=109263&VKNTCKN=&AliciAdi=&SenaryoId=&IlkTarih=&SonTarih=&FaturaIlkTarihi=Haziran+1%2C+2022&FaturaSonTarihi=Kas%C4%B1m+2%2C+2022++23%3A59%3A59&MinCost=&MaxCost=&AliciId=0&FaturaDurumu=-1&FaturaOnayDurumu=&FaturaTipiId=&OnlyUnReadedInvoice=false",
        "method": "POST"
    }).then(res => {
        // console.log(res.body);


        res.json().then(ok => {
            console.log(ok.data)
        })

    }).catch(err => {
        console.log(err)
    })

}

export const uyumsoftTest = async () => {

    const UYUMSOFT_WSDL_URL = "https://efatura-test.uyumsoft.com.tr/Services/Integration?wsdl";
    const UYUMSOFT_WSDL_PATH = path.join(__dirname, '../src/integration/uyumsoft.wsdl');;

    const UYUMSOFT_USERNAME = "Uyumsoft";
    const UYUMSOFT_PASSWORD = "Uyumsoft";

    console.log('WSDL Client Initialize Path: ', UYUMSOFT_WSDL_PATH);

    const parserOpts: OptionsV2 = { ignoreAttrs: true, explicitArray: false, tagNameProcessors: [processors.stripPrefix], valueProcessors: [parseNumbers, parseBooleans] };
    const xmlParser = new Parser(parserOpts);

    try {

        const security = new soap.WSSecurity(UYUMSOFT_USERNAME, UYUMSOFT_PASSWORD)
        const client = await uyumsoft.createClientAsync(UYUMSOFT_WSDL_PATH);
        client.setSecurity(security);

        const { GetInboxInvoicesAsync, GetSummaryReportAsync, GetInboxInvoiceAsync, } = client;

        const [result, raw] = await GetInboxInvoicesAsync({
            query: {
                ExecutionStartDate: null,
                ExecutionEndDate: null,
                //  InvoiceIds: [],
                //  InvoiceNumbers: [],
            }
        });

        let parsedResult = await xmlParser.parseStringPromise(raw);

        let Invoices: Array<UBL> = parsedResult.Envelope.Body.GetInboxInvoicesResponse.GetInboxInvoicesResult.Value.Items;









        // let invoices = result.GetInboxInvoicesResult.Value.Items;

        // console.log(invoices[0].Invoice.InvoiceLine.Price.PriceAmount['$value']);



        // let invoices = result.GetInboxInvoicesResult.Value.Items.map(obj => obj.Invoice.ID);

        // for (const inid of invoices) {
        //     const [invoice] = await GetInboxInvoiceAsync({invoiceId:inid});

        //     let data = invoice.GetInboxInvoiceResult;

        //     console.log(data);

        // }


        // const [summary] = await GetSummaryReportAsync({
        //     startDate: null,
        //     endDate: null
        // });

        // console.log(summary.GetSummaryReportResult);


    } catch (error) {
        console.log(error)
    }

}

export const isnetTEST = async () => {

    const ISNET_WSDL_URL = "http://einvoiceservicetest.isnet.net.tr/InvoiceService/ServiceContract/InvoiceService.svc?singleWsdl";
    const ISNET_WSDL_PATH = path.join(__dirname, '../', 'integration/isnet.wsdl');

    const ISNET_USERNAME = "16867951058" // "4059649806";
    const ISNET_PASSWORD = "Caner23!";   // "1234"

    const TEST_USERNAME = "4059649806";
    const TEST_PASSWORD = "1234"

    try {
        let security = new soap.WSSecurity(TEST_USERNAME, TEST_PASSWORD)
        let client = await isnet.createClientAsync(ISNET_WSDL_PATH);

        client.setSecurity(security);

        const { GetEttnListAsync, SearchInvoiceAsync } = client


        const [invoices, x, y, z] = await SearchInvoiceAsync({
            request: {
                CompanyTaxCode: '1234567805',
                InvoiceDirection: 'Incoming',
                ResultSet: {
                    IsAdditionalTaxIncluded: true,
                    IsXMLIncluded: true,
                    IsArchiveIncluded: true,
                    IsAttachmentIncluded: true,
                    IsHtmlIncluded: true,
                    IsInvoiceDetailIncluded: true,
                    IsExternalUrlIncluded: true,
                    IsPDFIncluded: false
                },
                // PagingRequest: {
                //     PageNumber:1,
                //     RecordsPerPage:10
                // }
            }
        })

        // const [ettns] = await GetEttnListAsync({
        //     request: {
        //         CompanyTaxCode: '1234567805',
        //         IncludeMainCompany: 'false',
        //         ResultSet:{
        //             IsXMLIncluded:true
        //         }
        //     }
        // })

        // console.log(ettns.GetEttnListResult)

        console.log(invoices.SearchInvoiceResult);
        // console.log(invoices.SearchAllInvoiceResult)

        // client.InvoiceService.InvoiceServiceBasicHttpEndpoint.SearchAllInvoice({
        //     request:{
        //         CompanyTaxCode:'6140592768',
        //         InvoiceDirection:'Incoming',
        //         ResultSet:{
        //             IsAdditionalTaxIncluded:true,
        //         }

        //     }}, (err, res) => {
        //         if(!err){
        //             console.log(res);
        //         }else{
        //             console.log(err);
        //         }
        // })


        // console.log(invoiceList.GetInboxInvoicesResult.Value.Items.length)


    } catch (error) {
        console.log(error)
    }

}

export const lastMenuUpdates = () => {
    console.log('FETCH')
    MenuDB.Memory.find({ selector: {} }).then(res => {
        res.docs.filter(obj => obj.hasOwnProperty('timestamp')).sort((a, b) => b.timestamp - a.timestamp).map(obj => {

            if (obj.timestamp)
                console.log(new Date(obj.timestamp).toDateString(), '    -    ', obj.slug,)
        })
    }).catch(err => {
        console.log(err);
    })
}


export const queueTest = async ( ) => {
    const queue = new Queue({
        concurrent: 3,
        interval: 3000,
      });

      let opts: PouchDB.Core.AllDocsOptions = { include_docs:true}

      let asyncTaskA  = async () => (await ManagementDB.Products.allDocs(opts)).rows.length
      let asyncTaskB  = async () => (await ManagementDB.Categories.allDocs(opts)).rows.length
      let asyncTaskC  = async () => (await ManagementDB.Producers.allDocs(opts)).rows.length

      queue.on("start", () => console.log('Queue Started'));
      queue.on("stop", () => console.log('Queue Stopped'));
      queue.on("end", () => console.log('Queue End'));
      
      queue.on("resolve", data => console.log(data));
      queue.on("reject", error => console.error(error));
      
      queue.enqueue(asyncTaskA); 
      queue.enqueue(asyncTaskB); 
      queue.enqueue(asyncTaskC); 
}

export const fixStringToNumber = async (store_id: string) => {

        try {
            const StoreDatabase = await StoreDB(store_id)
            let products : Array<Product> = (await StoreDatabase.find({selector:{ db_name:'products' }, limit:DatabaseQueryLimit })).docs
            let willUpdate: Array<Product> = [];
            products.map((product:any) => {

                if(typeof product.price == 'string' ) {
                    console.log(product.name);
                    product.price = parseFloat(product.price);
                    willUpdate.push(product);
                }

                product.specifies.map(x => {
                    if(typeof x.spec_price == 'string' ) {
                        console.log(x.spec_name);
                    } 
                    x.spec_price = parseFloat(x.spec_price);
                    return x;
                })
                // return product;
            })
            console.log(willUpdate.length  + ' Products Will Update');
            
            let update = await StoreDatabase.bulkDocs(willUpdate);

            console.log(update);

        } catch (error) {
            throw new Error('ERROR');
        }
}


export const menuStringFixer = (store_id:string) => {

    // console.log(typeof '22');

    ManagementDB.Databases.find({ selector:  { codename: 'CouchRadore' }}).then(dbs => {
        let CouchRadore: Database = dbs.docs[0];
        RemoteDB(CouchRadore, 'quickly-menu-app').find({ selector: { slug : 'kosmos-db15'} }).then(res  => {
            let menu :Menu = res.docs[0];
            menu.categories.map(cat => {
                // console.log(cat.name, cat.items.length, cat.item_groups.length);
                if(cat.item_groups.length > 0){
                    cat.item_groups.map(sub_cat => {
                        sub_cat.items.map(item => {
                            // console.log(typeof item.price, item.name)
                            if(item.options) {
                                if(typeof item.price == 'string'){
                                    console.log(item.name, item.price)
                                    item.price = parseFloat(item.price);
                                }
                                item.options.map(opt => {
                                    // console.log(typeof opt.price, opt.name)
                                    if(typeof opt.price == 'string'){
                                        console.log(item.name, opt.price)
                                        opt.price = parseFloat(opt.price);
                                    }
                                    return opt;
                                })
                            }else{
                                // console.log(typeof item.price, item.name)
                                if(typeof item.price == 'string'){
                                    console.log(item.name, item.price)
                                    item.price = parseFloat(item.price);
                                }
                            }

                            return item;
                        })
                        return sub_cat;
                    })
                }else{
                    cat.items.map(item => {
                        if(item.options) {
                            if(typeof item.price == 'string'){
                                console.log(item.name, item.price)
                                item.price = parseFloat(item.price);
                            }
                            item.options.map(opt => {
                                // console.log(typeof opt.price, opt.name)
                                if(typeof opt.price == 'string'){
                                    console.log(item.name, opt.price)
                                    opt.price = parseFloat(opt.price);
                                    return opt;
                                }
                            })
                        }else{
                            console.log(typeof item.price, item.name)
                            if(typeof item.price == 'string'){
                                console.log(item.name, item.price)
                                item.price = parseFloat(item.price);
                            }
                        }
                        return item;
                    })
                }
            })
            RemoteDB(CouchRadore, 'quickly-menu-app').put(menu).then(isOK => {
                console.log('Menu Updated');
            }).catch(err => {
                console.log('Err: ',err)
            })
        }).catch(err => {
            console.log(err);
        })
    })


}