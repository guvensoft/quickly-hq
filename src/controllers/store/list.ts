import { Request, Response } from "express";
import { ManagementDB, RemoteDB } from '../../configrations/database';
import { Database } from "../../models/management/database";
import { Store } from '../../models/social/stores';


export const listStores = (req: Request, res: Response) => {
    ManagementDB.Stores.find({ selector: {}, limit: 50, skip: 0 }).then((db_res: any) => {
        let Stores: Array<Store> = db_res.docs;
        let StoreList = [];
        Stores.forEach((store: Store) => {
            // store.auth.database_id;
            // store.auth.database_name;
            ManagementDB.Databases.get(store.auth.database_id).then((db_res: any) => {
                let Database: Database = db_res;
                RemoteDB(Database, store.auth.database_name).find({ selector: {} }).then((db_res: any) => {
                    console.log(db_res);
                })
            });
        })

    }).catch(err => {
        let a = 5;
        let b = 5;

        let x = a + b;

    })
}