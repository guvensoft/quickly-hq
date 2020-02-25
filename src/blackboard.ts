import { CouchDB, ManagementDB, RemoteDB, StoresDB, StoreDB } from './configrations/database';
import { Database } from './models/management/database';
import { Store } from './models/social/stores';
import { Stock, StockTransfer } from './models/store/pos/stocks';
import { backupPath } from './configrations/paths';
import { BackupData, EndDay } from './models/store/pos/endoftheday';
import { Report } from './models/store/pos/report';
import { Cashbox } from './models/store/pos/cashbox';
import { ClosedCheck, CheckProduct } from './models/store/pos/check';
import { Log } from './models/store/pos/log';
import { readJsonFile, writeJsonFile } from './functions/files';
import { writeFile, readFile, readFileSync } from 'fs';
import { Product } from './models/management/product';
import path from 'path';
import { createIndexesForDatabase } from './functions/database';
import { object, string } from 'joi';

import { Parser } from 'xml2js';

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
        const products: any = await RemoteDB(db.docs[0], db_name).find({ selector: { db_name: 'tables' }, limit: 2500 });
        const reports = await RemoteDB(db.docs[0], db_name).find({ selector: { db_name: 'reports', type: 'Table' }, limit: 2500 });
        let reportsWillUpdate = reports.docs;
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
        let enddays: Array<EndDay> = res.filter(obj => obj.db_name == 'endday').sort((a, b) => b.timestamp - a.timestamp).filter(obj => new Date(obj.timestamp).getDay() == 0);
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
                console.log(new Date(day.timestamp).toLocaleDateString('tr-TR'));
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
                console.log(err);
            })
            // }
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

export const allRevisions = (db_name: string) => {

    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];

        RemoteDB(db, db_name).find({ selector: { db_name: 'closed_checks' } }).then(res => {


            let test = res.docs[0]._id


        });


    });


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

export const documentTransport = (from: string, to: string, selector: any) => {
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
    // let position = { height: 100, width: 100, x: 100, y: 100, type: 0 };
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        RemoteDB(db, 'quickly-cafe-130c').find({ selector: { db_name: 'tables' }, limit: 2500 }).then((res: any) => {
            return res.docs.map(object => {
                // object.position = position;
                return object;
            });
        }).then(stocks => {
            RemoteDB(db, 'quickly-cafe-130c').bulkDocs(stocks).then(res => {
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