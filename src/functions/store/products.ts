import { DayInfo } from '../../models/store/settings';
import { StoreDB } from '../../configrations/database';
import { Ingredient } from '../../models/store/product';
import { Report } from '../../models/store/report';
import { Stock } from '../../models/store/stocks';
import { createLog } from '../../utils/logger';
import { LogType } from '../../utils/logger';

export interface CountData { product: string; count: number; total: number; };

export const countProductsData = (counDataArray: Array<CountData>, id: string, price: number, manuelCount?: number): Array<CountData> => {
    let countObj: CountData;
    if (manuelCount) {
        countObj = { product: id, count: manuelCount, total: price };
    } else {
        countObj = { product: id, count: 1, total: price };
    }
    let contains = counDataArray.some(obj => obj.product === id);
    if (contains) {
        let index = counDataArray.findIndex(p_id => p_id.product == id);
        if (manuelCount) {
            counDataArray[index].count += manuelCount;
        } else {
            counDataArray[index].count++;
        }
        counDataArray[index].total += price;
    } else {
        counDataArray.push(countObj);
    }
    return counDataArray;
}

export const updateProductReport = async (store_id: string | string[], count_data: Array<CountData>): Promise<boolean> => {
    try {
        const StoreDatabase = await StoreDB(store_id);
        const StoreDayInfo: DayInfo = await (await StoreDatabase.find({ selector: { key: 'DateSettings' } })).docs[0].value;
        const Month = new Date(StoreDayInfo.time).getMonth();

        count_data.forEach(async (obj: CountData) => {
            const ProductReport: Report = await (await StoreDatabase.find({ selector: { db_name: 'reports', connection_id: obj.product } })).docs[0];
            const ProductRecipe: Array<Ingredient> = await (await StoreDatabase.find({ selector: { db_name: 'recipes', product_id: obj.product } })).docs[0];
            if (ProductReport) {
                StoreDatabase.upsert(ProductReport._id, (doc: Report) => {
                    doc.count += obj.count;
                    doc.amount += obj.total;
                    doc.timestamp = Date.now();
                    doc.weekly[StoreDayInfo.day] += obj.total;
                    doc.weekly_count[StoreDayInfo.day] += obj.count;
                    doc.monthly[Month] += obj.total;
                    doc.weekly_count[Month] += obj.count;
                    return doc;
                })
            }
            if (ProductRecipe) {
                ProductRecipe.forEach(ingredient => {
                    let downStock = ingredient.amount * obj.count;
                    StoreDatabase.upsert(ingredient.stock_id, (doc: Stock) => {
                        doc.left_total -= downStock;
                        doc.quantity = doc.left_total / doc.total;
                        if (doc.left_total < doc.warning_limit) {
                            if (doc.left_total <= 0) {
                                doc.left_total = 0;
                                // this.logService.createLog(logType.STOCK_CHECKPOINT, doc._id, `${doc.name} adlı stok tükendi!`);
                            } else {
                                // this.logService.createLog(logType.STOCK_CHECKPOINT, doc._id, `${doc.name} adlı stok bitmek üzere! - Kalan: '${doc.left_total + ' ' + doc.unit}'`);
                            }
                        }
                        return doc;
                    });
                });
            }
        });
        return true;
    } catch (error) {
        console.log(error);
        createLog(null, LogType.DATABASE_ERROR, error);
    }
}