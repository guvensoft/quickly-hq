import { Request, Response } from "express";
import { DatabaseQueryLimit, ManagementDB } from "../../configrations/database";
import { Category, SubCategory } from "../../models/management/category";
import { createLog, LogType } from '../../utils/logger';
import { CategoryMessages } from "../../utils/messages";

//////  /category [POST]
export const createCategory = (req: Request, res: Response) => {
    let newCategory: Category = req.body;
    ManagementDB.Categories.find({ selector: { name: newCategory.name } }).then(category => {
        if (category.docs.length > 0) {
            res.status(CategoryMessages.CATEGORY_EXIST.code).json(CategoryMessages.CATEGORY_EXIST.response);
        } else {
            newCategory.timestamp = Date.now();
            ManagementDB.Categories.post(newCategory).then(() => {
                res.status(CategoryMessages.CATEGORY_CREATED.code).json(CategoryMessages.CATEGORY_CREATED.response);
            }).catch((err) => {
                res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            })
        }
    }).catch((err) => {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /category/:id [PUT]
export const updateCategory = (req: Request, res: Response) => {
    let categoryID = req.params.id;
    let formData = req.body;
    ManagementDB.Categories.get(categoryID).then(obj => {
        ManagementDB.Categories.put(Object.assign(obj, formData)).then(() => {
            res.status(CategoryMessages.CATEGORY_UPDATED.code).json(CategoryMessages.CATEGORY_UPDATED.response);
        }).catch((err) => {
            res.status(CategoryMessages.CATEGORY_NOT_UPDATED.code).json(CategoryMessages.CATEGORY_NOT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /category/:id [GET]
export const getCategory = (req: Request, res: Response) => {
    let categoryID = req.params.id;
    ManagementDB.Categories.get(categoryID).then((obj: any) => {
        res.send(obj);
    }).catch((err) => {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /category/:id [DELETE]
export const deleteCategory = (req: Request, res: Response) => {
    let userID = req.params.id;
    ManagementDB.Categories.get(userID).then(obj => {
        ManagementDB.Categories.remove(obj).then(() => {
            res.status(CategoryMessages.CATEGORY_DELETED.code).json(CategoryMessages.CATEGORY_DELETED.response);
        }).catch((err) => {
            res.status(CategoryMessages.CATEGORY_NOT_DELETED.code).json(CategoryMessages.CATEGORY_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /categories + QueryString [GET]
export const queryCategories = (req: Request, res: Response) => {
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Categories.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch((err) => {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /sub_category [POST]
export const createSubCategory = (req: Request, res: Response) => {
    let newSubCategory: SubCategory = req.body;
    ManagementDB.SubCategories.find({ selector: { name: newSubCategory.name } }).then(sub_category => {
        if (sub_category.docs.length > 0) {
            res.status(CategoryMessages.CATEGORY_EXIST.code).json(CategoryMessages.CATEGORY_EXIST.response);
        } else {
            newSubCategory.timestamp = Date.now();
            ManagementDB.SubCategories.post(newSubCategory).then(() => {
                res.status(CategoryMessages.CATEGORY_CREATED.code).json(CategoryMessages.CATEGORY_CREATED.response);
            }).catch((err) => {
                res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            })
        }
    }).catch((err) => {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /sub_category/:id [PUT]
export const updateSubCategory = (req: Request, res: Response) => {
    let sub_categoryID = req.params.id;
    let formData = req.body;
    ManagementDB.SubCategories.get(sub_categoryID).then(obj => {
        ManagementDB.SubCategories.put(Object.assign(obj, formData)).then(() => {
            res.status(CategoryMessages.CATEGORY_UPDATED.code).json(CategoryMessages.CATEGORY_UPDATED.response);
        }).catch((err) => {
            res.status(CategoryMessages.CATEGORY_NOT_UPDATED.code).json(CategoryMessages.CATEGORY_NOT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /sub_category/:id [GET]
export const getSubCategory = (req: Request, res: Response) => {
    let sub_categoryID = req.params.id;
    ManagementDB.SubCategories.get(sub_categoryID).then((obj: any) => {
        res.send(obj);
    }).catch((err) => {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /sub_category/:id [DELETE]
export const deleteSubCategory = (req: Request, res: Response) => {
    let userID = req.params.id;
    ManagementDB.SubCategories.get(userID).then(obj => {
        ManagementDB.SubCategories.remove(obj).then(() => {
            res.status(CategoryMessages.CATEGORY_DELETED.code).json(CategoryMessages.CATEGORY_DELETED.response);
        }).catch((err) => {
            res.status(CategoryMessages.CATEGORY_NOT_DELETED.code).json(CategoryMessages.CATEGORY_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch((err) => {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /sub_categories + QueryString [GET]
export const querySubCategories = (req: Request, res: Response) => {
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.SubCategories.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch((err) => {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};