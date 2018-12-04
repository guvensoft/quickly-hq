import { Response, Request } from "express";
import { ManagementDB } from "../databases/management";
import { UserGroup } from "../models/management/users";

export const createGroup = (req: Request, res: Response) => {
    let formData = req.body;
    ManagementDB.Groups.find({ selector: { name: formData.name } }).then(group => {
        if (group.docs.length > 0) {
            ////// Error
            res.json({ ok: false, message: "Girmiş olduğunuz Grup Adı mevcut. Lütfen farklı bir Grup Adı giririniz." });
        } else {
            let userGroup = new UserGroup(formData.name, formData.description, Date.now(), (formData.canRead ? true : false), (formData.canWrite ? true : false), (formData.canEdit ? true : false), (formData.canDelete ? true : false));
            ManagementDB.Groups.post(userGroup).then(db_res => {
                if (db_res.ok) {
                    res.json({ ok: true, message: "Grup Oluşturuldu." });
                }
            }).catch((err) => {
                ////// Error
                res.json({ ok: false, message: "Grup oluşturulamadı! Lütfen tekrar deneyin." });
            })
        }
    }).catch((err) => {
        ////// Error
        res.json({ ok: false, message: "Grup oluşturulamadı! Lütfen tekrar deneyin." });
    });
};

export const updateGroup = (req: Request, res: Response) => {
    let userID;
    ManagementDB.Groups.get(userID).then(obj => {
        ManagementDB.Groups.put(obj).then(db_res => {
            if (db_res.ok) {
                res.json({ ok: true, message: 'Grup Düzenlendi' });
            }
        }).catch((err) => {
            ////// Error
            res.json({ ok: false, message: 'Belirtilen Grup Düzenlenirken Hata Oluştu' });
        })
    }).catch((err) => {
        ////// Error
        res.json({ ok: false, message: 'Belirtilen Grup Bulunamadı.' });
    });
}

export const getGroup = (req: Request, res: Response) => {
    let groupID = req.params.id;
    ManagementDB.Groups.get(groupID).then((obj: any) => {
        res.send(obj);
    }).catch((err) => {
        ////// Error
        res.json({ ok: false, message: 'Belirtilen Grup Bulunamadı.' });
    });
}

export const deleteGroup = (req: Request, res: Response) => {
    let userID = req.params.id;
    ManagementDB.Groups.get(userID).then(obj => {
        ManagementDB.Groups.remove(obj).then(() => {
            res.json({ ok: true, message: 'Grup Silindi' });
        }).catch((err) => {
            ////// Error
            res.json({ ok: false, message: 'Grup Silinirken Hata Oluştu.' });
        })
    }).catch((err) => {
        ////// Error
        res.json({ ok: false, message: 'Belirtilen Grup Bulunamadı.' });
    });
}

export const queryGroups = (req: Request, res: Response) => {
    let qLimit = parseInt(req.query.limit) || 25;
    let qSkip = parseInt(req.query.skip) || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Groups.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch((err) => {
        ////// Error
        res.json({ ok: false, message: 'Grup Sorgusunda Hata!' });
    });
};