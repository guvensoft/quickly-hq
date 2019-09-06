import { Response, Request } from "express";
import { ManagementDB, DatabaseQueryLimit } from "../../configrations/database";
import { ProducerMessages } from '../../utils/messages';
import { createLog, LogType } from '../../utils/logger';
import { Producer } from "../../models/management/producer";


//////  /producer [POST]
export const createProducer = (req: Request, res: Response) => {
    let newProducer: Producer = req.body;
    ManagementDB.Producers.find({ selector: { name: newProducer.name } }).then(producers => {
        if (producers.docs.length > 0) {
            res.status(ProducerMessages.PRODUCER_EXIST.code).json(ProducerMessages.PRODUCER_EXIST.response);
        } else {
            newProducer.timestamp = Date.now();
            ManagementDB.Producers.post(newProducer).then(db_res => {
                res.status(ProducerMessages.PRODUCER_CREATED.code).json(ProducerMessages.PRODUCER_CREATED.response);
            }).catch((err) => {
                res.status(ProducerMessages.PRODUCER_NOT_CREATED.code).json(ProducerMessages.PRODUCER_NOT_CREATED.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            })
        }
    }).catch((err) => {
        res.status(ProducerMessages.PRODUCER_NOT_CREATED.code).json(ProducerMessages.PRODUCER_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /producer/:id [PUT]
export const updateProducer = (req: Request, res: Response) => {
    let producerID = req.params.id;
    let formData = req.body;
    ManagementDB.Producers.get(producerID).then(obj => {
        ManagementDB.Producers.put(Object.assign(obj, formData)).then(() => {
            res.status(ProducerMessages.PRODUCER_UPDATED.code).json(ProducerMessages.PRODUCER_UPDATED.response);
        }).catch(err => {
            res.status(ProducerMessages.PRODUCER_NOT_UPDATED.code).json(ProducerMessages.PRODUCER_NOT_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(ProducerMessages.PRODUCER_NOT_EXIST.code).json(ProducerMessages.PRODUCER_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /producer/:id [GET]
export const getProducer = (req: Request, res: Response) => {
    let producerID = req.params.id;
    ManagementDB.Producers.get(producerID).then((obj: any) => {
        res.send(obj);
    }).catch(err => {
        res.status(ProducerMessages.PRODUCER_NOT_EXIST.code).json(ProducerMessages.PRODUCER_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /producer/:id [DELETE]
export const deleteProducer = (req: Request, res: Response) => {
    let producerID = req.params.id;
    ManagementDB.Producers.get(producerID).then(obj => {
        ManagementDB.Producers.remove(obj).then(() => {
            res.status(ProducerMessages.PRODUCER_DELETED.code).json(ProducerMessages.PRODUCER_DELETED.response);
        }).catch(err => {
            res.status(ProducerMessages.PRODUCER_NOT_DELETED.code).json(ProducerMessages.PRODUCER_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(ProducerMessages.PRODUCER_NOT_EXIST.code).json(ProducerMessages.PRODUCER_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /producers + QueryString [GET]
export const queryProducers = (req: Request, res: Response) => {
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Producers.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        res.status(ProducerMessages.PRODUCER_NOT_EXIST.code).json(ProducerMessages.PRODUCER_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};