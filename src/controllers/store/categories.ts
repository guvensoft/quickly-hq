import { Request, Response } from "express";
import { StoreCollection, DatabaseQueryLimit } from '../../configrations/database';
import { CategoryMessages } from '../../utils/messages';
import { Report } from "../../models/store/pos/report.mock";


////// /categories/new [POST]
export const createCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const CategoryWillCreate = { db_name: 'categories', db_seq: 0, ...req.body };
        const Category = await StoreDB.post(CategoryWillCreate);
        const CategoryReport = new Report('categories', Category.id, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], '', Date.now());
        StoreDB.post({ db_name: 'reports', db_seq: 0, ...CategoryReport });
        res.status(CategoryMessages.CATEGORY_CREATED.code).json(CategoryMessages.CATEGORY_CREATED.response);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
    }
}

////// /categories/id [DELETE]
export const deleteCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const Category = await StoreDB.get(req.params.id);
        const CategoryReport = await StoreDB.find({ selector: { db_name: 'reports', connection_id: Category._id } });
        StoreDB.remove(Category);
        StoreDB.remove(CategoryReport.docs[0]);
        res.status(CategoryMessages.CATEGORY_DELETED.code).json(CategoryMessages.CATEGORY_DELETED.response);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_DELETED.code).json(CategoryMessages.CATEGORY_NOT_DELETED.response);
    }

}

////// /categories/id [PUT]
export const updateCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const Category = await StoreDB.get(req.params.id);
        await StoreDB.put({ Category, ...req.body });
        res.status(CategoryMessages.CATEGORY_CREATED.code).json(CategoryMessages.CATEGORY_CREATED.response);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
    }

}

////// /categories/id [GET]
export const getCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const Category = await StoreDB.get(req.params.id);
        res.json(Category);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
    }
}

////// /categories + QueryString [GET]
export const queryCategories = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const Categories = await StoreDB.find({ selector: { db_name: 'categories', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Categories.docs);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
    }
}

////// /sub_categories/new [POST]
export const createSubCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const SubCategoryWillCreate = { db_name: 'sub_categories', db_seq: 0, ...req.body };
        const SubCategory = await StoreDB.post(SubCategoryWillCreate);
        const SubCategoryReport = new Report('sub_categories', SubCategory.id, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], '', Date.now());
        StoreDB.post(Object.assign(SubCategoryReport, { db_name: 'reports', db_seq: 0 }));
        res.status(CategoryMessages.CATEGORY_CREATED.code).json(CategoryMessages.CATEGORY_CREATED.response);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
    }
}

////// /sub_categories/id [DELETE]
export const deleteSubCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const SubCategory = await StoreDB.get(req.params.id);
        const SubCategoryReport = await StoreDB.find({ selector: { db_name: 'reports', connection_id: SubCategory._id } });
        StoreDB.remove(SubCategory);
        StoreDB.remove(SubCategoryReport.docs[0]);
        res.status(CategoryMessages.CATEGORY_DELETED.code).json(CategoryMessages.CATEGORY_DELETED.response);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_DELETED.code).json(CategoryMessages.CATEGORY_NOT_DELETED.response);
    }

}

////// /sub_categories/id [PUT]
export const updateSubCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const SubCategory = await StoreDB.get(req.params.id);
        await StoreDB.put({ SubCategory, ...req.body });
        res.status(CategoryMessages.CATEGORY_CREATED.code).json(CategoryMessages.CATEGORY_CREATED.response);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
    }

}

////// /sub_categories/id [GET]
export const getSubCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const SubCategory = await StoreDB.get(req.params.id);
        res.json(SubCategory);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
    }
}

////// /sub_categories + QueryString [GET]
export const querySubCategories = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoreDB = await StoreCollection(StoreID);
        const SubCategories = await StoreDB.find({ selector: { db_name: 'sub_categories', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(SubCategories.docs);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
    }
}