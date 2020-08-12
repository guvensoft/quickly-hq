import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { CustomerMessages } from '../../utils/messages';
import { Report } from "../../models/store/pos/report";
import { Customer } from "../../models/store/pos/customer";

////// /customers/new [POST]
export const createCustomer = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const newCustomer: Customer = req.body;
    try {
        const StoresDB = await StoreDB(StoreID);
        const CustomerWillCreate = { db_name: 'customers', db_seq: 0, ...newCustomer };
        // const CustomerReport = new Report('Customer', newCustomer);
        await StoresDB.post(CustomerWillCreate);
        // await StoresDB.post({ db_name: 'reports', db_seq: 0, ...CustomerReport });
        res.status(CustomerMessages.CUSTOMER_CREATED.code).json(CustomerMessages.CUSTOMER_CREATED.response);
    } catch (error) {
        res.status(CustomerMessages.CUSTOMER_NOT_CREATED.code).json(CustomerMessages.CUSTOMER_NOT_CREATED.response);
    }
}

////// /customers/id [DELETE]
export const deleteCustomer = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Customer = await StoresDB.get(req.params.id);
        const CustomerReport = await StoresDB.find({ selector: { db_name: 'reports', connection_id: Customer._id } });
        StoresDB.remove(Customer);
        StoresDB.remove(CustomerReport.docs[0]);
        res.status(CustomerMessages.CUSTOMER_DELETED.code).json(CustomerMessages.CUSTOMER_DELETED.response);
    } catch (error) {
        res.status(CustomerMessages.CUSTOMER_NOT_DELETED.code).json(CustomerMessages.CUSTOMER_NOT_DELETED.response);
    }

}

////// /customers/id [PUT]
export const updateCustomer = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Customer = await StoresDB.get(req.params.id);
        await StoresDB.put({ Customer, ...req.body });
        res.status(CustomerMessages.CUSTOMER_CREATED.code).json(CustomerMessages.CUSTOMER_CREATED.response);
    } catch (error) {
        res.status(CustomerMessages.CUSTOMER_NOT_CREATED.code).json(CustomerMessages.CUSTOMER_NOT_CREATED.response);
    }

}

////// /customers/id [GET]
export const getCustomer = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Customer = await StoresDB.get(req.params.id);
        res.json(Customer);
    } catch (error) {
        res.status(CustomerMessages.CUSTOMER_NOT_CREATED.code).json(CustomerMessages.CUSTOMER_NOT_CREATED.response);
    }
}

////// /customers + QueryString [GET]
export const queryCustomers = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const StoresDB = await StoreDB(StoreID);
        const Customers = await StoresDB.find({ selector: { db_name: 'customers', ...req.query }, limit: qLimit, skip: qSkip });
        res.json(Customers.docs);
    } catch (error) {
        res.status(CustomerMessages.CUSTOMER_NOT_EXIST.code).json(CustomerMessages.CUSTOMER_NOT_EXIST.response);
    }
}