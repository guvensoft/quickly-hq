import { readJsonFile } from '../files';
import { backupPath } from '../../configrations/paths';
import { ManagementDB, RemoteDB } from '../../configrations/database';
import { EndDay } from '../../models/store/pos/endoftheday';
import { Report } from '../../models/store/pos/report';
import { BackupData } from '../../models/store/pos/endoftheday';
import { ClosedCheck, CheckStatus, CheckType } from '../../models/store/pos/check';
import { Cashbox } from '../../models/store/pos/cashbox';
import { Log } from '../../models/store/pos/log';
import { Database } from '../../models/management/database';


interface SalesReport { cash: number; card: number; coupon: number; free: number; canceled: number; discount: number; checks: number; customers: { male: number, female: number } }

export const StoreReport = async (store_id: string | string[], dayDataFile: string) => {
    try {
        const reportsOfDay: Array<BackupData> = await readJsonFile(backupPath + `${store_id}/days/${dayDataFile}`);
        return reportsOfDay;
    } catch (error) {
        console.log(error);
    }
}

export const StoreSalesReport = (checks: Array<ClosedCheck>) => {

    let SalesReport: SalesReport = { cash: 0, card: 0, coupon: 0, free: 0, canceled: 0, discount: 0, checks: checks.length, customers: { male: 0, female: 0 } };

    SalesReport.cash = checks.filter(obj => obj.payment_method == 'Nakit').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    SalesReport.card = checks.filter(obj => obj.payment_method == 'Kart').map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    SalesReport.coupon = checks.filter(obj => obj.payment_method == 'Kupon').map(obj => obj.total_price).reduce((a, b) => a + b, 0);

    SalesReport.free = checks.filter(obj => obj.type !== CheckType.CANCELED && obj.payment_method == 'İkram').map(obj => obj.total_price).reduce((a, b) => a + b, 0);

    SalesReport.canceled = checks.filter(obj => obj.type == CheckType.CANCELED).map(obj => obj.total_price).reduce((a, b) => a + b, 0);
    SalesReport.discount = checks.filter(obj => obj.type !== CheckType.CANCELED).map(obj => obj.discount).reduce((a, b) => a + b, 0);

    SalesReport.customers.male = checks.filter(obj => obj.type !== CheckType.CANCELED).map(obj => obj.occupation.male).reduce((a, b) => a + b, 0);
    SalesReport.customers.female = checks.filter(obj => obj.type !== CheckType.CANCELED).map(obj => obj.occupation.female).reduce((a, b) => a + b, 0);
    
    const partial = checks.filter(obj => obj.payment_method == 'Parçalı');

    partial.forEach(element => {

        SalesReport.discount += element.discount;

        element.payment_flow.forEach(payment => {
            if (payment.method == 'Nakit') {
                SalesReport.cash += payment.amount;
            }
            if (payment.method == 'Kart') {
                SalesReport.card += payment.amount;
            }
            if (payment.method == 'Kupon') {
                SalesReport.coupon += payment.amount;
            }
            if (payment.method == 'İkram') {
                SalesReport.free += payment.amount;
            }
        })
    });

    return SalesReport;
}

export const UserProductSalesReport = (userId: string, checksToCount: Array<ClosedCheck>) => {
    let dayProducts = [];
    let userProductsSaleReport = [];
    try {
        checksToCount.forEach(obj => {
            let productsPayed;
            if (obj.payment_flow) {
                productsPayed = obj.payment_flow.map(payment => payment.payed_products);
                dayProducts = dayProducts.concat(obj.products, productsPayed);
            } else {
                dayProducts = dayProducts.concat(obj.products);
            }
        });
        dayProducts.forEach(product => {
            try {
                if (product.owner == userId) {
                    let contains = userProductsSaleReport.some(obj => obj.name == product.name);
                    if (contains) {
                        let index = userProductsSaleReport.findIndex(obj => obj.name == product.name);
                        userProductsSaleReport[index].count++;
                    } else {
                        let countObj = { product_id: product.id, category_id: product.cat_id, name: product.name, count: 1 };
                        userProductsSaleReport.push(countObj);
                    }
                }
            } catch (error) {
                console.log(product, error);
            }
        });
        userProductsSaleReport.sort((a, b) => b.count - a.count);
        return userProductsSaleReport;
    } catch (error) {
        console.log(error);
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