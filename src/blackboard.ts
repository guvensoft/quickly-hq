import path from 'path';
import { writeFile, readFile, readFileSync } from 'fs';
import { CouchDB, ManagementDB, RemoteDB, StoresDB, StoreDB, DatabaseQueryLimit, RemoteCollection } from './configrations/database';
import { Database } from './models/management/database';
import { Store } from './models/management/store';
import { Stock } from './models/store/stocks';
import { backupPath, documentsPath, reisPath } from './configrations/paths';
import { BackupData, EndDay } from './models/store/endoftheday';
import { Report, reportType } from './models/store/report';
import { Cashbox } from './models/store/cashbox';
import { ClosedCheck, CheckProduct, Check, CheckType } from './models/store/check';
import { Log, logType } from './models/store/log';
import { readJsonFile, writeJsonFile, readDirectory } from './functions/files';
import { createIndexesForDatabase, purgeDatabase, createStoreDatabase } from './functions/database';

import { Parser } from 'xml2js';
import { Table, TableStatus } from './models/store/table';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { Menu, MenuStatus, Order } from './models/store/menu';
import { Category, Product, ProductSpecs, SubCategory } from './models/store/product';
import { productToStock } from './functions/stocks';
import { endDayProcess } from './controllers/store/endofday';

import { StoreReport, ProductsReport, UsersReport, UserProductSalesReport, TablesReport, StoreSalesReport, createReport } from './functions/store/reports';
import { getSession } from './controllers/management/session';

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

export const makePdf = async (db_name: string, start_date: number, end_date: number) => {
    try {

        const db = await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } });
        const enddays: Array<EndDay> = await (await RemoteDB(db.docs[0], db_name).find({ selector: { db_name: 'endday' }, limit: 2500 })).docs;
        const doc = new jsPDF({ orientation: "portrait" }); // landscape
        const transformPrice = (value: number): string => {
            if (!value) value = 0;
            return Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' TL'; /// ₺
        }
        const totalProperty = (property: string) => {
            return transformPrice(data.map(obj => obj[property]).reduce((a, b) => a + b, 0))
        }


        let bodyLink = [];
        let data = enddays.sort((a, b) => a.timestamp - b.timestamp).filter((day) => day.timestamp > start_date && day.timestamp < end_date)

        // hitDates.some(function(dateStr) {
        //     var date = new Date(dateStr);
        //     return date >= startDate && date <= endDate
        // });

        data.forEach((end, index) => {
            let data = [new Date(end.timestamp).toLocaleDateString('tr', { year: 'numeric', month: '2-digit', day: '2-digit' }), transformPrice(end.total_income), transformPrice(end.cash_total), transformPrice(end.card_total), transformPrice(end.coupon_total), transformPrice(end.free_total), transformPrice(end.canceled_total), transformPrice(end.discount_total)];
            bodyLink.push(data);
        });
        // const imgData = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0ia2F0bWFuXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTk1LjMgMjgwLjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU5NS4zIDI4MC40OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO30NCgkuc3Qxe2ZpbGw6I0UzMDYxMzt9DQo8L3N0eWxlPg0KPGcgaWQ9IlhNTElEXzNfIj4NCgk8ZyBpZD0iWE1MSURfMzY0NDZfIj4NCgkJPHBhdGggaWQ9IlhNTElEXzc2XyIgY2xhc3M9InN0MCIgZD0iTTE2Ni4xLDgxYzAsMzMuNC0yNiw2MC42LTU4LDYwLjZjLTMyLjIsMC01OC4yLTI3LjItNTguMi02MC42YzAtMzMuNiwyNi02MC44LDU4LjItNjAuOA0KCQkJQzE0MC4xLDIwLjIsMTY2LjEsNDcuNCwxNjYuMSw4MXogTTE1OS40LDgxYzAtMjkuMS0yMy41LTUyLjktNTEuNC01Mi45Yy0yOCwwLTUxLDIzLjktNTEsNTIuOWMwLDI4LjksMjMsNTIuOSw1MSw1Mi45DQoJCQlDMTM1LjksMTM0LDE1OS40LDEwOS45LDE1OS40LDgxeiIvPg0KCQk8cGF0aCBpZD0iWE1MSURfMzY0NjBfIiBjbGFzcz0ic3QwIiBkPSJNMTc3LjUsMTAwLjVjLTAuMy0yLjgtMC4yLTQuNSwwLjItNDUuOGg2LjZ2NDYuOWMxLjcsMTguNSwxOC42LDMzLjEsMzQuNSwzMy4xDQoJCQljMTUuNywwLDMwLjctMTEuOCwzNC4zLTI5LjhWNTQuN2g2LjZ2ODcuMWgtNi42di0xOC42YzAsMC00LjksNS45LTkuNCw5LjZjLTcuMSw1LjctMTUuOCw5LjEtMjQuOSw5LjFjLTE0LjMsMC0yNy4zLTcuOC0zNS0yMS4xDQoJCQlDMTgwLjMsMTE0LjYsMTc4LjEsMTA3LjcsMTc3LjUsMTAwLjV6Ii8+DQoJCTxwYXRoIGlkPSJYTUxJRF8zNjQ1N18iIGNsYXNzPSJzdDAiIGQ9Ik0yNzAuOSwyNC4zYzAtMi4zLDEuOS00LDQtNGMyLjMsMCw0LDEuNyw0LDRjMCwyLjEtMS43LDMuOC00LDMuOA0KCQkJQzI3Mi44LDI4LjEsMjcwLjksMjYuMywyNzAuOSwyNC4zeiBNMjc3LjksNTQuOXY4Ny40aC03VjU0LjlIMjc3Ljl6Ii8+DQoJCTxwYXRoIGlkPSJYTUxJRF8zNjQ1NV8iIGNsYXNzPSJzdDAiIGQ9Ik0zNTYuNCw2MC43bC0zLjMsNi42Yy01LjktMy44LTEyLjctNS43LTE5LjktNS43Yy0yMC4yLDAtMzYuNiwxNi40LTM2LjYsMzYuNg0KCQkJYzAsMjAsMTYuNCwzNi42LDM2LjYsMzYuNmM3LjEsMCwxNC4xLTIuMSwyMC02LjFsMy4xLDYuOGMtNyw0LjQtMTUsNi42LTIzLjIsNi42Yy0yNC4yLDAtNDMuOS0xOS43LTQzLjktNDMuOQ0KCQkJYzAtMjQuNCwxOS43LTQ0LjEsNDMuOS00NC4xQzM0MS40LDU0LDM0OS41LDU2LjMsMzU2LjQsNjAuN3oiLz4NCgkJPHBhdGggaWQ9IlhNTElEXzM2NDUzXyIgY2xhc3M9InN0MCIgZD0iTTM5NC40LDkxLjdsNDAuMSw1MC4zaC03LjNsLTM2LjktNDUuMWwtMTQuNiwxNy44VjE0MmgtNy4xVjExLjVoNy4xdjkxLjZsNDAuNi00OC4yDQoJCQlsOS42LTAuMkwzOTQuNCw5MS43eiIvPg0KCQk8cGF0aCBpZD0iWE1MSURfMzY0NTFfIiBjbGFzcz0ic3QwIiBkPSJNNDU0LjgsMTAuOHYxMzFoLTcuNXYtMTMxSDQ1NC44eiIvPg0KCQk8cGF0aCBpZD0iWE1MSURfMzY0NDlfIiBjbGFzcz0ic3QwIiBkPSJNNTExLjEsMTMxLjdsLTIzLjMsNTQuM2gtNy44bDIxLjktNTFMNDY3LDU0LjloNy44bDMwLjcsNjkuOGwzMC44LTY5LjhoNy43TDUxMS4xLDEzMS43eiINCgkJCS8+DQoJCTxwYXRoIGlkPSJYTUxJRF83NV8iIGNsYXNzPSJzdDAiIGQ9Ik0xMzkuNSwxODAuMWMxLjEsMS45LDAuMywzLjgtMC4zLDUuNmMtMS4yLDMuNi0yLjQsNy4yLTMuNiwxMC44Yy0xLjIsMy41LTIuMyw2LjktMy41LDEwLjQNCgkJCWMtMS40LDQuMi0yLjgsOC41LTQuMiwxMi43Yy0xLjMsNC0yLjcsOC00LDEyYy0xLjIsMy42LTIuNCw3LjItMy42LDEwLjhjLTEuMiwzLjUtMi4zLDYuOS0zLjUsMTAuNGMtMS40LDQuMS0yLjgsOC4zLTQuMSwxMi41DQoJCQljLTAuMywxLTAuNywyLjEtMS4xLDMuMWMtMC42LDEuNi0yLDIuNC00LDIuNGMtMS41LDAtMi44LTEtMy4zLTIuNWMtMS4zLTMuOC0yLjUtNy41LTMuOC0xMS4zYy0xLjItMy42LTIuNC03LjItMy42LTEwLjkNCgkJCWMtMS4zLTQtMi42LTcuOS00LTExLjljLTEuNC00LjEtMi44LTguMy00LjItMTIuNGMtMS4zLTQtMi43LTguMS00LTEyLjFjLTEuNC00LjEtMi43LTguMi00LjEtMTIuM2MtMS4yLTMuNS0yLjMtNy0zLjUtMTAuNQ0KCQkJYy0wLjMtMC44LTAuNS0xLjYtMC44LTIuM2MtMC42LTEuNS0wLjctMywwLjItNC40YzAuMy0wLjMsMC43LTAuNywxLTFjMi43LTEuMyw0LjItMC41LDUuOSwxLjJjOCw4LDE2LDE2LDI0LDI0DQoJCQljMC42LDAuNiwwLjYsMC42LDEuMywwYzcuNi03LjYsMTUuMi0xNS4yLDIyLjgtMjIuOGMwLjctMC43LDEuNC0xLjQsMi4xLTJjMC40LTAuMywwLjktMC42LDEuNC0wLjhjMS4yLTAuNSwyLjQtMC4xLDMuNSwwLjUNCgkJCUMxMzguOCwxNzkuNCwxMzkuMiwxNzkuNywxMzkuNSwxODAuMXoiLz4NCgkJPHBhdGggaWQ9IlhNTElEXzc0XyIgY2xhc3M9InN0MSIgZD0iTTE2Mi42LDE2MS4yYy01LjIsNS45LTExLjgsOC45LTE4LjYsOC45Yy0xNy44LDAuMi0yMi44LTIwLjktMzYuNC0yMS4xDQoJCQljLTUuMiwwLTEwLjEsMi40LTE0LjEsNy4zbC00LjItNS40YzUuMi02LjEsMTEuNy05LjQsMTguMy05LjRjMTYuNywwLDIxLjgsMjEuMSwzNi40LDIwLjljNS40LDAsMTAuNS0yLjYsMTQuMy03LjFMMTYyLjYsMTYxLjJ6Ig0KCQkJLz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg==';
        // const imgData = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0ia2F0bWFuXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTk1LjMgMjgwLjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU5NS4zIDI4MC40OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO30NCgkuc3Qxe2ZpbGw6I0UzMDYxMzt9DQo8L3N0eWxlPg0KPGcgaWQ9IlhNTElEXzNfIj4NCgk8ZyBpZD0iWE1MSURfMzY0NDZfIj4NCgkJPHBhdGggaWQ9IlhNTElEXzc2XyIgY2xhc3M9InN0MCIgZD0iTTE2Ni4xLDgxYzAsMzMuNC0yNiw2MC42LTU4LDYwLjZjLTMyLjIsMC01OC4yLTI3LjItNTguMi02MC42YzAtMzMuNiwyNi02MC44LDU4LjItNjAuOA0KCQkJQzE0MC4xLDIwLjIsMTY2LjEsNDcuNCwxNjYuMSw4MXogTTE1OS40LDgxYzAtMjkuMS0yMy41LTUyLjktNTEuNC01Mi45Yy0yOCwwLTUxLDIzLjktNTEsNTIuOWMwLDI4LjksMjMsNTIuOSw1MSw1Mi45DQoJCQlDMTM1LjksMTM0LDE1OS40LDEwOS45LDE1OS40LDgxeiIvPg0KCQk8cGF0aCBpZD0iWE1MSURfMzY0NjBfIiBjbGFzcz0ic3QwIiBkPSJNMTc3LjUsMTAwLjVjLTAuMy0yLjgtMC4yLTQuNSwwLjItNDUuOGg2LjZ2NDYuOWMxLjcsMTguNSwxOC42LDMzLjEsMzQuNSwzMy4xDQoJCQljMTUuNywwLDMwLjctMTEuOCwzNC4zLTI5LjhWNTQuN2g2LjZ2ODcuMWgtNi42di0xOC42YzAsMC00LjksNS45LTkuNCw5LjZjLTcuMSw1LjctMTUuOCw5LjEtMjQuOSw5LjFjLTE0LjMsMC0yNy4zLTcuOC0zNS0yMS4xDQoJCQlDMTgwLjMsMTE0LjYsMTc4LjEsMTA3LjcsMTc3LjUsMTAwLjV6Ii8+DQoJCTxwYXRoIGlkPSJYTUxJRF8zNjQ1N18iIGNsYXNzPSJzdDAiIGQ9Ik0yNzAuOSwyNC4zYzAtMi4zLDEuOS00LDQtNGMyLjMsMCw0LDEuNyw0LDRjMCwyLjEtMS43LDMuOC00LDMuOA0KCQkJQzI3Mi44LDI4LjEsMjcwLjksMjYuMywyNzAuOSwyNC4zeiBNMjc3LjksNTQuOXY4Ny40aC03VjU0LjlIMjc3Ljl6Ii8+DQoJCTxwYXRoIGlkPSJYTUxJRF8zNjQ1NV8iIGNsYXNzPSJzdDAiIGQ9Ik0zNTYuNCw2MC43bC0zLjMsNi42Yy01LjktMy44LTEyLjctNS43LTE5LjktNS43Yy0yMC4yLDAtMzYuNiwxNi40LTM2LjYsMzYuNg0KCQkJYzAsMjAsMTYuNCwzNi42LDM2LjYsMzYuNmM3LjEsMCwxNC4xLTIuMSwyMC02LjFsMy4xLDYuOGMtNyw0LjQtMTUsNi42LTIzLjIsNi42Yy0yNC4yLDAtNDMuOS0xOS43LTQzLjktNDMuOQ0KCQkJYzAtMjQuNCwxOS43LTQ0LjEsNDMuOS00NC4xQzM0MS40LDU0LDM0OS41LDU2LjMsMzU2LjQsNjAuN3oiLz4NCgkJPHBhdGggaWQ9IlhNTElEXzM2NDUzXyIgY2xhc3M9InN0MCIgZD0iTTM5NC40LDkxLjdsNDAuMSw1MC4zaC03LjNsLTM2LjktNDUuMWwtMTQuNiwxNy44VjE0MmgtNy4xVjExLjVoNy4xdjkxLjZsNDAuNi00OC4yDQoJCQlsOS42LTAuMkwzOTQuNCw5MS43eiIvPg0KCQk8cGF0aCBpZD0iWE1MSURfMzY0NTFfIiBjbGFzcz0ic3QwIiBkPSJNNDU0LjgsMTAuOHYxMzFoLTcuNXYtMTMxSDQ1NC44eiIvPg0KCQk8cGF0aCBpZD0iWE1MSURfMzY0NDlfIiBjbGFzcz0ic3QwIiBkPSJNNTExLjEsMTMxLjdsLTIzLjMsNTQuM2gtNy44bDIxLjktNTFMNDY3LDU0LjloNy44bDMwLjcsNjkuOGwzMC44LTY5LjhoNy43TDUxMS4xLDEzMS43eiINCgkJCS8+DQoJCTxwYXRoIGlkPSJYTUxJRF83NV8iIGNsYXNzPSJzdDAiIGQ9Ik0xMzkuNSwxODAuMWMxLjEsMS45LDAuMywzLjgtMC4zLDUuNmMtMS4yLDMuNi0yLjQsNy4yLTMuNiwxMC44Yy0xLjIsMy41LTIuMyw2LjktMy41LDEwLjQNCgkJCWMtMS40LDQuMi0yLjgsOC41LTQuMiwxMi43Yy0xLjMsNC0yLjcsOC00LDEyYy0xLjIsMy42LTIuNCw3LjItMy42LDEwLjhjLTEuMiwzLjUtMi4zLDYuOS0zLjUsMTAuNGMtMS40LDQuMS0yLjgsOC4zLTQuMSwxMi41DQoJCQljLTAuMywxLTAuNywyLjEtMS4xLDMuMWMtMC42LDEuNi0yLDIuNC00LDIuNGMtMS41LDAtMi44LTEtMy4zLTIuNWMtMS4zLTMuOC0yLjUtNy41LTMuOC0xMS4zYy0xLjItMy42LTIuNC03LjItMy42LTEwLjkNCgkJCWMtMS4zLTQtMi42LTcuOS00LTExLjljLTEuNC00LjEtMi44LTguMy00LjItMTIuNGMtMS4zLTQtMi43LTguMS00LTEyLjFjLTEuNC00LjEtMi43LTguMi00LjEtMTIuM2MtMS4yLTMuNS0yLjMtNy0zLjUtMTAuNQ0KCQkJYy0wLjMtMC44LTAuNS0xLjYtMC44LTIuM2MtMC42LTEuNS0wLjctMywwLjItNC40YzAuMy0wLjMsMC43LTAuNywxLTFjMi43LTEuMyw0LjItMC41LDUuOSwxLjJjOCw4LDE2LDE2LDI0LDI0DQoJCQljMC42LDAuNiwwLjYsMC42LDEuMywwYzcuNi03LjYsMTUuMi0xNS4yLDIyLjgtMjIuOGMwLjctMC43LDEuNC0xLjQsMi4xLTJjMC40LTAuMywwLjktMC42LDEuNC0wLjhjMS4yLTAuNSwyLjQtMC4xLDMuNSwwLjUNCgkJCUMxMzguOCwxNzkuNCwxMzkuMiwxNzkuNywxMzkuNSwxODAuMXoiLz4NCgkJPHBhdGggaWQ9IlhNTElEXzc0XyIgY2xhc3M9InN0MSIgZD0iTTE2Mi42LDE2MS4yYy01LjIsNS45LTExLjgsOC45LTE4LjYsOC45Yy0xNy44LDAuMi0yMi44LTIwLjktMzYuNC0yMS4xDQoJCQljLTUuMiwwLTEwLjEsMi40LTE0LjEsNy4zbC00LjItNS40YzUuMi02LjEsMTEuNy05LjQsMTguMy05LjRjMTYuNywwLDIxLjgsMjEuMSwzNi40LDIwLjljNS40LDAsMTAuNS0yLjYsMTQuMy03LjFMMTYyLjYsMTYxLjJ6Ig0KCQkJLz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg=='

        const imgData =
            `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="katman_1" x="0px" y="0px" viewBox="0 0 595.3 280.4" style="enable-background:new 0 0 595.3 280.4;" xml:space="preserve">
        <style type="text/css">
            .st0{fill:#FFFFFF;}
            .st1{fill:#E30613;}
        </style>
        <g id="XMLID_3_">
            <g id="XMLID_36446_">
                <path id="XMLID_76_" class="st0" d="M166.1,81c0,33.4-26,60.6-58,60.6c-32.2,0-58.2-27.2-58.2-60.6c0-33.6,26-60.8,58.2-60.8    C140.1,20.2,166.1,47.4,166.1,81z M159.4,81c0-29.1-23.5-52.9-51.4-52.9c-28,0-51,23.9-51,52.9c0,28.9,23,52.9,51,52.9    C135.9,134,159.4,109.9,159.4,81z"/>
                <path id="XMLID_36460_" class="st0" d="M177.5,100.5c-0.3-2.8-0.2-4.5,0.2-45.8h6.6v46.9c1.7,18.5,18.6,33.1,34.5,33.1    c15.7,0,30.7-11.8,34.3-29.8V54.7h6.6v87.1h-6.6v-18.6c0,0-4.9,5.9-9.4,9.6c-7.1,5.7-15.8,9.1-24.9,9.1c-14.3,0-27.3-7.8-35-21.1    C180.3,114.6,178.1,107.7,177.5,100.5z"/>
                <path id="XMLID_36457_" class="st0" d="M270.9,24.3c0-2.3,1.9-4,4-4c2.3,0,4,1.7,4,4c0,2.1-1.7,3.8-4,3.8    C272.8,28.1,270.9,26.3,270.9,24.3z M277.9,54.9v87.4h-7V54.9H277.9z"/>
                <path id="XMLID_36455_" class="st0" d="M356.4,60.7l-3.3,6.6c-5.9-3.8-12.7-5.7-19.9-5.7c-20.2,0-36.6,16.4-36.6,36.6    c0,20,16.4,36.6,36.6,36.6c7.1,0,14.1-2.1,20-6.1l3.1,6.8c-7,4.4-15,6.6-23.2,6.6c-24.2,0-43.9-19.7-43.9-43.9    c0-24.4,19.7-44.1,43.9-44.1C341.4,54,349.5,56.3,356.4,60.7z"/>
                <path id="XMLID_36453_" class="st0" d="M394.4,91.7l40.1,50.3h-7.3l-36.9-45.1l-14.6,17.8V142h-7.1V11.5h7.1v91.6l40.6-48.2    l9.6-0.2L394.4,91.7z"/>
                <path id="XMLID_36451_" class="st0" d="M454.8,10.8v131h-7.5v-131H454.8z"/>
                <path id="XMLID_36449_" class="st0" d="M511.1,131.7l-23.3,54.3h-7.8l21.9-51L467,54.9h7.8l30.7,69.8l30.8-69.8h7.7L511.1,131.7z"/>
                <path id="XMLID_75_" class="st0" d="M139.5,180.1c1.1,1.9,0.3,3.8-0.3,5.6c-1.2,3.6-2.4,7.2-3.6,10.8c-1.2,3.5-2.3,6.9-3.5,10.4    c-1.4,4.2-2.8,8.5-4.2,12.7c-1.3,4-2.7,8-4,12c-1.2,3.6-2.4,7.2-3.6,10.8c-1.2,3.5-2.3,6.9-3.5,10.4c-1.4,4.1-2.8,8.3-4.1,12.5    c-0.3,1-0.7,2.1-1.1,3.1c-0.6,1.6-2,2.4-4,2.4c-1.5,0-2.8-1-3.3-2.5c-1.3-3.8-2.5-7.5-3.8-11.3c-1.2-3.6-2.4-7.2-3.6-10.9    c-1.3-4-2.6-7.9-4-11.9c-1.4-4.1-2.8-8.3-4.2-12.4c-1.3-4-2.7-8.1-4-12.1c-1.4-4.1-2.7-8.2-4.1-12.3c-1.2-3.5-2.3-7-3.5-10.5    c-0.3-0.8-0.5-1.6-0.8-2.3c-0.6-1.5-0.7-3,0.2-4.4c0.3-0.3,0.7-0.7,1-1c2.7-1.3,4.2-0.5,5.9,1.2c8,8,16,16,24,24    c0.6,0.6,0.6,0.6,1.3,0c7.6-7.6,15.2-15.2,22.8-22.8c0.7-0.7,1.4-1.4,2.1-2c0.4-0.3,0.9-0.6,1.4-0.8c1.2-0.5,2.4-0.1,3.5,0.5    C138.8,179.4,139.2,179.7,139.5,180.1z"/>
                <path id="XMLID_74_" class="st1" d="M162.6,161.2c-5.2,5.9-11.8,8.9-18.6,8.9c-17.8,0.2-22.8-20.9-36.4-21.1    c-5.2,0-10.1,2.4-14.1,7.3l-4.2-5.4c5.2-6.1,11.7-9.4,18.3-9.4c16.7,0,21.8,21.1,36.4,20.9c5.4,0,10.5-2.6,14.3-7.1L162.6,161.2z"/>
            </g>
        </g>
        </svg>
        `;

        // doc.addSvgAsImage(imgData,10,10,200,100);
        doc.setLanguage('tr')
        autoTable(doc, {
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
            head: [['Tarih', 'Toplam', 'Nakit', 'Kart', 'Kupon', 'Ikram', 'Iptal', 'Indirim']],
            foot: [['Genel Toplam', totalProperty('total_income'), totalProperty('cash_total'), totalProperty('card_total'), totalProperty('coupon_total'), totalProperty('free_total'), totalProperty('canceled_total'), totalProperty('discount_total')]],
            body: bodyLink,
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

    const Database = await (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
    const StoreDatabase = await StoreDB(store_id);

    let products = (await StoreDatabase.find({ selector: { db_name: 'products' }, limit: 2000 })).docs;
    let categories = (await StoreDatabase.find({ selector: { db_name: 'categories', limit: 2000 } })).docs;
    let sub_categories = (await StoreDatabase.find({ selector: { db_name: 'sub_categories', limit: 2000 } })).docs;
    let reports = (await StoreDatabase.find({ selector: { db_name: 'reports', type: 'Product', limit: 2000 } })).docs;

    let docsWillRemove = [...products, ...categories, ...sub_categories, ...reports];

    docsWillRemove.map(obj => obj._deleted = true);

    let isRemoved = await StoreDatabase.bulkDocs(docsWillRemove);

    console.log(isRemoved)

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

        Menu.categories.forEach((category, index) => {
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
        })
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
    // const t0 = performance.now();

    const Days: Array<EndDay> = (await (await StoreDB(store_id)).find({ selector: { db_name: 'endday' } })).docs.sort((a, b) => a.timestamp - b.timestamp);
    const BackupData: Array<BackupData> = await StoreReport(store_id, Days[0].timestamp.toString(), Days[Days.length - 1].timestamp.toString());
    const Checks: Array<ClosedCheck> = BackupData.find(backup => backup.database == 'closed_checks').docs;
    const Sales = StoreSalesReport(Checks);
    console.log(Sales);

    // const t1 = performance.now();
    // console.log(`Call took ${t1 - t0} milliseconds.`);
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


export const quicklySellingData = async (year: number) => {
    const monthlyLabels = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

    const Stores = (await ManagementDB.Stores.find({ selector: {} })).docs;

    let Days = [];
    let Months = [];

    for (const store of Stores) {

        let storeEndDayData: Array<EndDay> = (await (await StoreDB(store._id)).find({ selector: { db_name: 'endday' }, limit: DatabaseQueryLimit })).docs

        let endDayData = storeEndDayData.filter(obj => new Date(obj.timestamp).getFullYear() == year);

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

    const StoreDatabase = await StoreDB(store_id);
    let Documents = await StoreDatabase.find({ selector: { db_name: 'orders' }, limit: 40000 })
    console.log(Documents.docs.length);

    Documents.docs.map(obj => {
        obj._deleted = true;
        return obj
    })

    // for (const document of Documents.docs) {

    //     const Response = await StoreDatabase.remove(document);
    //     console.log(Response);
    // }

    const BulkPost = await StoreDatabase.bulkDocs(Documents.docs);
    console.log(BulkPost);
}


