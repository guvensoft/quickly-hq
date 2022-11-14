import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit, ManagementDB, StoresDB } from '../../configrations/database';
import { Store } from '../../models/management/store';

export const saveSettings = async (req: Request, res: Response) => {
    const StoreID = req.headers.store as string;
    const Store = req.body as Store;

    console.log(Store)

    try {
        // let storeSettings = await StoresDB.Settings.get(StoreID);
        // if (storeSettings) {
        //     console.log(storeSettings);
        // } else {
        //     console.log('Error:', 'No Settings Finded!')
        // }
        await ManagementDB.Stores.put(Store);
        let updatedStore = await ManagementDB.Stores.get(StoreID);
        res.status(200).json({ ok:true, message:'İşletme Ayarları Kaydedildi', store: updatedStore })
    } catch (error) {
        res.status(400).json({ ok:true, message:'Hata Oluştu!' })
        console.log(error);
    }
}

export const getSettings = async (req: Request, res: Response) => {
    const StoreID = req.headers.store as string;
    const Store = req.body as Store;
    try {
        let storeSettings = await StoresDB.Settings.get(StoreID);
        if (storeSettings) {
            console.log(storeSettings);
        } else {
            console.log('Error:', 'No Settings Finded!')
        }
        console.log(Store)
    } catch (error) {
        console.log(error);
    }
}