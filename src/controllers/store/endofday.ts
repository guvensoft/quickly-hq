import { Request, Response } from "express";
import { StoreDB } from '../../configrations/database';
import { backupPath } from '../../configrations/paths';
import { readDirectory, writeJsonFile } from "../../functions/files";
import { mkdir } from "fs";
import { clearStoreDatabase } from "../../functions/database";

export const uploadBackup = async (req: Request, res: Response) => {
    const Store = req.headers.store;
    const StoreDatabase = await StoreDB(Store);
    StoreDatabase.find({ selector: { db_name: 'endday', data_file: req.body.timestamp } }).then(db_res => {
        readDirectory(backupPath + `${Store}/days/`).then(exist => {
            writeJsonFile(backupPath + `${Store}/days/${req.body.timestamp}`, req.body.data).then(isOk => {
                res.status(200).json({ ok: true, message: 'Upload Process Succesfull!' })
            }).catch(err => {
                console.log(err);
                res.status(400).json({ ok: false, message: err })
            })
        }).catch(err => {
            mkdir(backupPath + `${Store}/days/`, { recursive: true }, (err) => {
                if (!err) {
                    writeJsonFile(backupPath + `${Store}/days/${req.body.timestamp}`, req.body.data).then(isOk => {
                        res.status(200).json({ ok: true, message: 'Upload Process Succesfull!' })
                    }).catch(err => {
                        console.log(err);
                        res.status(400).json({ ok: false, message: err })
                    })
                } else {
                    console.log(err);
                    res.status(400).json({ ok: false, message: err })
                }
            })
        })
    }).catch(err => {
        res.status(400).json({ ok: false, message: 'Not Uploaded!' })
    })
}

export const endDayProcess = (req: Request, res: Response) => {
    console.log('Store', req.headers.store);
    const Store: any = req.headers.store;
    clearStoreDatabase(Store).then(isOk => {
        console.log(isOk);
        res.status(201).json({ok:true , message:'Gün Sonu İşlemi Tamamlandı'});
    }).catch(err => {
        res.status(400).json({ ok: false, message: 'Error: '+ err })
    })

}
