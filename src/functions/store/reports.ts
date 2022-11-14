import { ManagementDB ,StoreDB } from '../../configrations/database';
import { backupPath } from '../../configrations/paths';
import { CheckProduct, CheckType, ClosedCheck } from '../../models/store/check';
import { BackupData, EndDay } from '../../models/store/endoftheday';
import { Category, Product, SubCategory } from '../../models/store/product';
import { Activity, Report, reportType, activityType } from '../../models/store/report';
import { Stock } from '../../models/store/stocks';
import { Floor, Table } from '../../models/store/table';
import { User, UserGroup } from '../../models/store/user';
import { readDirectory, readJsonFile, writeJsonFile } from '../shared/files';

//// Third Party
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import XLSX from 'xlsx';


interface SalesReport { cash: number; card: number; coupon: number; free: number; canceled: number; discount: number; checks: number; customers: { male: number, female: number } }
interface ProductSalesReport { product_id: string; owner_id: string; category_id: string; price: number; total:number, name: string; count: number; }
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
    let productsSaleReport = [];
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
                    let contains = productsSaleReport.some(obj => obj.name == product.name);
                    if (contains) {
                        let index = productsSaleReport.findIndex(obj => obj.name == product.name);
                        productsSaleReport[index].count++;
                    } else {
                        let countObj = { product_id: product.id, category_id: product.cat_id, name: product.name, count: 1 };
                        productsSaleReport.push(countObj);
                    }
                }
            } catch (error) {
                console.log(product, error);
            }
        });
        productsSaleReport.sort((a, b) => b.count - a.count);
        return productsSaleReport;
    } catch (error) {
        console.log(error);
    }
}

export const ProductSalesReport = (product_id: string, checks_to_count: Array<ClosedCheck>) => {
    let dayProducts = [];
    let productsSaleReport = [];
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
                if (product._id == product_id) {
                    let contains = productsSaleReport.some(obj => obj.name == product.name);
                    if (contains) {
                        let index = productsSaleReport.findIndex(obj => obj.name == product.name);
                        productsSaleReport[index].count++;
                    } else {
                        let countObj = { product_id: product.id, category_id: product.cat_id, name: product.name, count: 1 };
                        productsSaleReport.push(countObj);
                    }
                }
            } catch (error) {
                console.log(product, error);
            }
        });
        productsSaleReport.sort((a, b) => b.count - a.count);
        return productsSaleReport;
    } catch (error) {
        console.log(error);
    }
}

export const UsersReport = (checks_to_count: Array<ClosedCheck>): Array<UserSalesReport> => {
    let dayProducts = [];
    let productSalesReport: Array<UserSalesReport> = [];
    try {
        checks_to_count.forEach(obj => {
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

export const ProductsReport = (checks_to_count: Array<ClosedCheck>): Array<ProductSalesReport> => {
    let dayProducts = [];
    let productSalesReport: Array<ProductSalesReport> = [];
    try {
        checks_to_count.forEach(obj => {
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
                    productSalesReport[index].total += product.price;
                } else {
                    let countObj: ProductSalesReport = { product_id: product.id, owner_id: product.owner, category_id: product.cat_id, price: product.price, total:product.price, name: product.name, count: 1 };
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

export const TablesReport = (checks_to_count: Array<ClosedCheck>): Array<TableSalesReport> => {
    let tablesReport = [];
    try {
        checks_to_count.forEach(check => {
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

export const createActivity = (activityType: activityType, activityName: string): Activity => {
    return {
        type: activityType,
        name: activityName,
        activity: [],
        activity_time: [],
        activity_count: [],
    }
}

export const createReport = (reportType: reportType, reportObj: Product | Table | Floor | User | UserGroup | Category | SubCategory | Stock): Report => {
    const date = new Date();
    const weeklyArray = new Array(7).fill(0, 0, 7);
    const monthlyArray = new Array(12).fill(0, 0, 12);
    return {
        type: reportType,
        connection_id: reportObj._id,
        count: 0,
        amount: 0,
        profit: 0,
        weekly: weeklyArray,
        weekly_count: weeklyArray,
        monthly: monthlyArray,
        monthly_count: monthlyArray,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        description: reportObj.name,
        timestamp: Date.now(),
        db_name:'reports',
        db_seq:0
    }
}

export const exportReport = async (store_id: string, start_date: number, end_date: number, endDayData?: Array<EndDay>) => {
    try {
        let StoreEndDays: Array<EndDay>;
        if (!endDayData) {
            StoreEndDays = (await (await StoreDB(store_id)).find({ selector: { db_name: 'endday' }, limit: 2500 })).docs
        } else {
            StoreEndDays = endDayData;
        writeJsonFile('endday.json',endDayData);

        }
        const Store = await ManagementDB.Stores.get(store_id)
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

        const xlsxData = [].concat(tableHeadData,tableBodyData,tableFootData);
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(xlsxData);
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, ReportDate);

		XLSX.writeFile(wb, Store.name + '-' + ReportDate + '.xlsx');
        PDF.save(Store.name + '-' + ReportDate + '.pdf');
    } catch (err) {
        console.log(err);
    }
}

export const exportReportFromDaysData  = async (store_id: string, start_date?: string, end_date?: string) => {
    let storeBackups: Array<string> = await readDirectory(backupPath + `${store_id}/days/`);
    let storeDays: Array<number> = storeBackups.map(day => parseInt(day)).sort((a, b) => b - a).filter(date => date > parseInt(start_date) && date < parseInt(end_date));
    let endDayConvertedData: Array<EndDay> = [];
    console.log(storeDays);
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
                owner: '51819909-9461-4f15-b65e-cc6f903c0de1', //// Need To Change
                timestamp: date - 39_600_000,
                customers: salesReport.customers,
                db_name:'endday',
                db_seq:0
            }
            endDayConvertedData.push(endDayObj);
            console.log(endDayObj)
        } catch (error) {
            console.log(error);
        }
    }
    // exportReport(store_id, parseInt(start_date), parseInt(end_date), endDayConvertedData)
}