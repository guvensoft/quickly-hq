import { v4 as uuidv4 } from 'uuid';
import neatCsv from 'neat-csv'
// import * as fs from 'fs';


interface MenuDocConfig { cigaretteSelling: boolean, _id: string, _rev: string };


const csvMenuToJsonDoc = async (file: Buffer, config: MenuDocConfig) => {
    let data = await neatCsv(file, { separator: ";" });
    return onDataReceived(data, config);
}

/**
 * Her bir satırı kategoriye göre sınıflandırıyor
 */
const mapCategoriesToObjectKeys = (categoryGroup) => {
    return categoryGroup.reduce((r, v, i, a, k = v["category"]) => ((r[k] || (r[k] = [])).push(v), r), {})
}

/**
 * Satırdan category nesnesi döndürür.
 */
const buildCategoryObject = (categoryGroup) => {
    const doc = {
        categories: [],
    };

    const keys = Object.keys(categoryGroup);
    for (let i = 0; i < keys.length; i++) {
        let categoryRow = categoryGroup[keys[i]]; // category items array

        let obj = {
            // category model object
            id: (i + 1).toString(),
            name: keys[i],
            image: categoryRow[0].category_image, // First category_image will be use.
            items: [],
            item_groups: [],
        };

        categoryRow.forEach((row) => {
            if (row.sub_category && row.sub_category !== "") {
                // // categoryRow[k] belongs to item_group property.
                let subCategoryIndex = obj.item_groups.findIndex(
                    (o) => o.name === row.sub_category
                );
                if (subCategoryIndex == -1) {
                    // subCategory does not exists.
                    obj.item_groups.push({
                        name: row.sub_category,
                        description: null,
                        items: [{ ...buildProductObject(row) }],
                    });
                } else {
                    // subCategory item already exists.
                    obj.item_groups[subCategoryIndex].items.push(buildProductObject(row));
                }
            } else {
                // categoryRow[k] belongs to items property.
                obj.items.push(buildProductObject(row));
            }
        });

        doc.categories.push(obj);
    }

    return doc;
}

/**
 * Kategori olarak gruplanmış nesnedeki satırları alt kategori grupları olarak atar.
 */
const buildItemGroup = (categoryRow) => {
    return categoryRow.reduce((r, v, i, a, k = v["sub_category"]) => ((r[k] || (r[k] = [])).push(v), r), {})
}

/**
 * Satırdan product nesnesi döndürür.
 */
const buildProductObject = (productRow) => {
    let obj = {
        productId: null,
        id: uuidv4(),
        name: productRow.name,
        price: productRow.price,
        description: productRow.description,
        isHidden: productRow.hidden,
    };
    return obj;
}

/**
 * Builds restaurant document
 */
const buildMenuDocument = (menu, config) => {
    return {
        _id: config._id,
        _rev: config._rev,
        name: config.name,
        documentType: "restaurant",
        location: config.location,
        cigaretteSelling: config.cigaretteSelling,
        brandColor: "#fff",
        promotions: [{ image: "/kampanya/default.png" }],
        categories: menu.categories,
    };
}

/**
 * CSV okunduktan sonra data bu fonksiyona veriliyor
 */
const onDataReceived = (data, config) => {
    let groupedByCategory = mapCategoriesToObjectKeys(data);
    let categories = buildCategoryObject(groupedByCategory);
    let menuDocument = buildMenuDocument(categories, config);
    return menuDocument;
}