import { readJsonFile, readDirectory } from '../files';
import { backupPath } from '../../configrations/paths';
import { BackupData } from '../../models/store/endoftheday';
import { ClosedCheck, CheckStatus, CheckType, CheckProduct } from '../../models/store/check';

interface SalesReport { cash: number; card: number; coupon: number; free: number; canceled: number; discount: number; checks: number; customers: { male: number, female: number } }
interface ProductSalesReport { product_id: string; owner_id: string; category_id: string; price: number; name: string; count: number; }
interface UserSalesReport { product_id: string; owner_id: string; category_id: string; price: number; name: string; count: number; }
interface TableSalesReport { table_id: string; price: number; discount: number; count: number, customers: { male: number, female: number } };

export const StoreReport = async (store_id: string | string[], start_date: string, end_date?: string) => {
    if (start_date) {
        if (end_date) {
            try {
                let durationData: Array<BackupData> = [
                    { database: 'closed_checks', docs: [] },
                    { database: 'cashbox', docs: [] },
                    { database: 'reports', docs: [] },
                    { database: 'logs', docs: [] },
                ];
                let backupFiles: Array<string> = await readDirectory(backupPath + `${store_id}/days/`);
                backupFiles = backupFiles.filter(date => parseInt(date) > parseInt(start_date) && parseInt(date) < parseInt(end_date));
                for (const data_file of backupFiles) {
                    let reportsOfDay: Array<BackupData> = await readJsonFile(backupPath + `${store_id}/days/${data_file}`);
                    reportsOfDay = reportsOfDay.filter(obj => obj.database == 'closed_checks' || obj.database == 'cashbox');
                    for (const day of reportsOfDay) {
                        durationData.find(obj => obj.database == day.database).docs.push(...day.docs);
                    }
                }
                return durationData;
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                let reportsOfDay: Array<BackupData> = await readJsonFile(backupPath + `${store_id}/days/${start_date}`);
                return reportsOfDay;
            } catch (error) {
                console.log(error);
            }
        }
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
    SalesReport.customers.male = checks.filter(obj => obj.type !== CheckType.CANCELED && obj.hasOwnProperty('occupation')).map(obj => obj.occupation.male).reduce((a, b) => a + b, 0);
    SalesReport.customers.female = checks.filter(obj => obj.type !== CheckType.CANCELED && obj.hasOwnProperty('occupation')).map(obj => obj.occupation.female).reduce((a, b) => a + b, 0);
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

export const UserProductSalesReport = (user_id: string, checks_to_count: Array<ClosedCheck>) => {
    let dayProducts = [];
    let userProductsSaleReport = [];
    try {
        checks_to_count.forEach(obj => {
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
                if (product.owner == user_id) {
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


export const UsersReport = (checksToCount: Array<ClosedCheck>): Array<UserSalesReport> => {
    let dayProducts = [];
    let productSalesReport: Array<UserSalesReport> = [];
    try {
        checksToCount.forEach(obj => {
            let productsPayed;
            if (obj.payment_flow) {
                productsPayed = obj.payment_flow.map(payment => payment.payed_products);
                productsPayed.forEach(element => {
                    dayProducts = dayProducts.concat(obj.products, element);
                });
            } else {
                dayProducts = dayProducts.concat(obj.products);
            }
        });
        dayProducts.forEach((product: CheckProduct) => {
            try {
                const contains = productSalesReport.some(obj => obj.name === product.name && obj.owner_id === product.owner);
                if (contains) {
                    let index = productSalesReport.findIndex(obj => obj.name === product.name && obj.owner_id === product.owner);
                    productSalesReport[index].count++;
                } else {
                    let countObj: UserSalesReport = { product_id: product.id, owner_id: product.owner, category_id: product.cat_id, price: product.price, name: product.name, count: 1 };
                    productSalesReport.push(countObj);
                }
            } catch (error) {
                console.log(product, error);
            }
        });
        productSalesReport.sort((a, b) => b.count - a.count);
        return productSalesReport;
    } catch (error) {
        console.log(error);
    }
}

export const ProductsReport = (checksToCount: Array<ClosedCheck>): Array<ProductSalesReport> => {
    let dayProducts = [];
    let productSalesReport: Array<ProductSalesReport> = [];
    try {
        checksToCount.forEach(obj => {
            let productsPayed;
            if (obj.payment_flow) {
                productsPayed = obj.payment_flow.map(payment => payment.payed_products);
                productsPayed.forEach(element => {
                    dayProducts = dayProducts.concat(obj.products, element);
                });
            } else {
                dayProducts = dayProducts.concat(obj.products);
            }
        });
        dayProducts.forEach((product: CheckProduct) => {
            try {
                const contains = productSalesReport.some(obj => obj.name === product.name);
                if (contains) {
                    let index = productSalesReport.findIndex(obj => obj.name === product.name);
                    productSalesReport[index].count++;
                } else {
                    let countObj: ProductSalesReport = { product_id: product.id, owner_id: product.owner, category_id: product.cat_id, price: product.price, name: product.name, count: 1 };
                    productSalesReport.push(countObj);
                }
            } catch (error) {
                console.log(product, error);
            }
        });
        productSalesReport.sort((a, b) => b.count - a.count);
        return productSalesReport;
    } catch (error) {
        console.log(error);
    }
}


export const TablesReport = (checksToCount: Array<ClosedCheck>): Array<TableSalesReport> => {
    let tablesReport = [];
    try {
        checksToCount.forEach(check => {
            const contains = tablesReport.some(obj => obj.table_id == check.table_id);
            if (contains) {
                let index = tablesReport.findIndex(obj => obj.table_id === check.table_id);

                tablesReport[index].count++;
                tablesReport[index].price = tablesReport[index].price + check.total_price;
                tablesReport[index].discount = tablesReport[index].discount + check.discount;

                if (check.hasOwnProperty('occupation')) {
                    tablesReport[index].customers.male += check.occupation.male;
                    tablesReport[index].customers.female += check.occupation.female;
                } else {
                    tablesReport[index].customers.male += 1;
                    tablesReport[index].customers.female += 1;
                }
            } else {
                let newReportScheme: TableSalesReport;
                if (check.hasOwnProperty('occupation')) {
                    newReportScheme = { table_id: check.table_id, price: check.total_price, discount: check.discount, count: 1, customers: { male: check.occupation.male, female: check.occupation.female } }
                } else {
                    newReportScheme = { table_id: check.table_id, price: check.total_price, discount: check.discount, count: 1, customers: { male: 1, female: 1 } }
                }
                tablesReport.push(newReportScheme);
            }
        })
        tablesReport = tablesReport.sort((a, b) => b.count - a.count);
        return tablesReport;
    } catch (error) {
        console.log(error);
    }
}