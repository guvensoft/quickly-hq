import { ManagementDB, RemoteDB } from '../configrations/database';
import { Database } from '../models/management/database';
import { Report } from '../models/store/pos/report.mock';

export const dailyStockExpense = () => {
    ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } }).then((res: any) => {
        let db: Database = res.docs[0];
        let store_db = RemoteDB(db, 'kosmos-db15');
        store_db.find({ selector: { db_name: 'products' }, limit: 2500 }).then(res => {
            console.log(res.docs.length);
            return res.docs;
        }).then((productsArray: any) => {
            let sold_products = store_db.find({ selector: { db_name: 'reports', type: 'Product' }, limit: 2500 }).then((res: any) => {
                let today = 4;
                let sold_products: Array<Report> = res.docs.filter(obj => obj.weekly_count[today] > 0).sort((a, b) => b.weekly_count[today] - a.weekly_count[today]);
                sold_products.forEach(element => {
                    let product = productsArray.find(obj => obj._id == element.connection_id);
                    console.log(element.weekly_count[today], product.name);
                });
            })
        });
    })
}
