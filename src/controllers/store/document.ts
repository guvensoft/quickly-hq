import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { StoreDocumentMessages } from '../../utils/messages';

export const getDocument = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const Document = req.params.id;
    try {
        const Database = await StoreDB(StoreID);
        const ResponseData = await Database.get(Document);
        res.json(ResponseData);
    } catch (error) {
        res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
    }
}

export const createDocument = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const Document = req.body;
    try {
        const Database = await StoreDB(StoreID);
        const ResponseData = await Database.post(Document);
        res.json(ResponseData);
    } catch (error) {
        res.status(StoreDocumentMessages.DOCUMENT_NOT_CREATED.code).json(StoreDocumentMessages.DOCUMENT_NOT_CREATED.code);
    }
}

export const updateDocument = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const Document = req.body;
    try {
        const Database = await StoreDB(StoreID);
        await Database.put(Document)
        res.status(StoreDocumentMessages.DOCUMENT_UPDATED.code).json(StoreDocumentMessages.DOCUMENT_UPDATED.code);
    } catch (error) {
        res.status(StoreDocumentMessages.DOCUMENT_NOT_UPDATED.code).json(StoreDocumentMessages.DOCUMENT_NOT_UPDATED.code);
    }
}

export const deleteDocument = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const Document = req.params.id;
    try {
        const Database = await StoreDB(StoreID);
        const DocumentWillRemove = await Database.get(Document);
        await Database.remove(DocumentWillRemove);
        res.status(StoreDocumentMessages.DOCUMENT_DELETED.code).json(StoreDocumentMessages.DOCUMENT_DELETED.code);
    } catch (error) {
        res.status(StoreDocumentMessages.DOCUMENT_NOT_DELETED.code).json(StoreDocumentMessages.DOCUMENT_NOT_DELETED.code);
    }
}

export const queryDocuments = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const qLimit = req.query.limit || DatabaseQueryLimit;
    const qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    try {
        const Database = await StoreDB(StoreID);
        const ResponseData = await Database.find({ selector: { ...{ db_name: req.params.db_name }, ...req.query }, limit: qLimit, skip: qSkip });
        if(ResponseData.docs.length > 0) {
            res.json(ResponseData.docs);
        }else{
            res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
        }
    } catch (error) {
        res.status(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code).json(StoreDocumentMessages.DOCUMENT_NOT_EXIST.code);
    }
}