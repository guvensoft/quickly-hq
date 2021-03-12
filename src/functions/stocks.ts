import { ManagementDB, RemoteDB } from '../configrations/database';
import { Database } from '../models/management/database';
import { Report } from '../models/store/report';
import { Product } from '../models/management/product';

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

export const productToStock = (product: Product, quantity: number, warning?: number, warehouse?: string) => {
    return {
        name: product.name,
        description: product.description,
        unit: product.unit,
        portion: product.portion,
        quantity: quantity,
        first_quantity: quantity,
        total: product.portion,
        left_total: product.portion * quantity,
        first_total: product.portion * quantity,
        warning_value: (warning ? warning : 25),
        warning_limit: (product.portion * quantity) * (warning ? warning : 25) / 100,
        category: product.category,
        sub_category: product.sub_category,
        producer: product.producer_id,
        product: product._id,
        warehouse: (warehouse ? warehouse : ''),
        supplier: '',
        timestamp: Date.now(),
    }
}