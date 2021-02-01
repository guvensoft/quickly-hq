import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { CategoryMessages } from '../../utils/messages';
import { Report } from "../../models/store/report";
import { Category, SubCategory } from "../../models/store/product";

////// /categories/new [POST]
export const createCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const newCategory: Category = req.body;
    try {
        const StoresDB = await StoreDB(StoreID);
        const CategoryWillCreate = { db_name: 'categories', db_seq: 0, ...newCategory };
        // const CategoryReport = new Report('Category', newCategory);
        await StoresDB.post(CategoryWillCreate);
        // await StoresDB.post({ db_name: 'reports', db_seq: 0, ...CategoryReport });
        res.status(CategoryMessages.CATEGORY_CREATED.code).json(CategoryMessages.CATEGORY_CREATED.response);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
    }
}

////// /categories/id [DELETE]
export const deleteCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Category = await StoresDB.get(req.params.id);
        const CategoryReport = await StoresDB.find({ selector: { db_name: 'reports', connection_id: Category._id } });
        StoresDB.remove(Category);
        StoresDB.remove(CategoryReport.docs[0]);
        res.status(CategoryMessages.CATEGORY_DELETED.code).json(CategoryMessages.CATEGORY_DELETED.response);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_DELETED.code).json(CategoryMessages.CATEGORY_NOT_DELETED.response);
    }

}

////// /categories/id [PUT]
export const updateCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Category = await StoresDB.get(req.params.id);
        await StoresDB.put({ Category, ...req.body });
        res.status(CategoryMessages.CATEGORY_CREATED.code).json(CategoryMessages.CATEGORY_CREATED.response);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
    }

}

////// /categories/id [GET]
export const getCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Category = await StoresDB.get(req.params.id);
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
        const StoresDB = await StoreDB(StoreID);
        const Categories = await StoresDB.find({ selector: { db_name: 'categories', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Categories.docs);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
    }
}

////// /sub_categories/new [POST]
export const createSubCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const newSubCategory: SubCategory = req.body;
    try {
        const StoresDB = await StoreDB(StoreID);
        const SubCategoryWillCreate = { db_name: 'sub_categories', db_seq: 0, ...newSubCategory };
        // const SubCategoryReport = new Report('SubCategory', newSubCategory);
        await StoresDB.post(SubCategoryWillCreate);
        // await StoresDB.post({ db_name: 'reports', db_seq: 0, ...SubCategoryReport });
        res.status(CategoryMessages.CATEGORY_CREATED.code).json(CategoryMessages.CATEGORY_CREATED.response);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
    }
}

////// /sub_categories/id [DELETE]
export const deleteSubCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const SubCategory = await StoresDB.get(req.params.id);
        const SubCategoryReport = await StoresDB.find({ selector: { db_name: 'reports', connection_id: SubCategory._id } });
        StoresDB.remove(SubCategory);
        StoresDB.remove(SubCategoryReport.docs[0]);
        res.status(CategoryMessages.CATEGORY_DELETED.code).json(CategoryMessages.CATEGORY_DELETED.response);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_DELETED.code).json(CategoryMessages.CATEGORY_NOT_DELETED.response);
    }

}

////// /sub_categories/id [PUT]
export const updateSubCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const SubCategory = await StoresDB.get(req.params.id);
        await StoresDB.put({ SubCategory, ...req.body });
        res.status(CategoryMessages.CATEGORY_CREATED.code).json(CategoryMessages.CATEGORY_CREATED.response);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_CREATED.code).json(CategoryMessages.CATEGORY_NOT_CREATED.response);
    }

}

////// /sub_categories/id [GET]
export const getSubCategory = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const SubCategory = await StoresDB.get(req.params.id);
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
        const StoresDB = await StoreDB(StoreID);
        const SubCategories = await StoresDB.find({ selector: { db_name: 'sub_categories', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(SubCategories.docs);
    } catch (error) {
        res.status(CategoryMessages.CATEGORY_NOT_EXIST.code).json(CategoryMessages.CATEGORY_NOT_EXIST.response);
    }
}