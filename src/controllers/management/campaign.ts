import { Response, Request } from "express";
import { ManagementDB, DatabaseQueryLimit } from "../../configrations/database";
import { CampaignMessages } from '../../utils/messages';
import { Campaign } from "../../models/management/campaing";
import { createLog, LogType } from '../../utils/logger';

//////  /campaign [POST]
export const createCampaing = (req: Request, res: Response) => {
    let newCampaing: Campaign = req.body;
    ManagementDB.Campaings.find({ selector: { name: newCampaing.name } }).then(campaings => {
        if (campaings.docs.length > 0) {
            res.status(CampaignMessages.CAMPAIGN_EXIST.code).json(CampaignMessages.CAMPAIGN_EXIST.response);
        } else {
            newCampaing.timestamp = Date.now();
            ManagementDB.Campaings.post(newCampaing).then(() => {
                res.status(CampaignMessages.CAMPAIGN_CREATED.code).json(CampaignMessages.CAMPAIGN_CREATED.response);
            }).catch(err => {
                res.status(CampaignMessages.CAMPAIGN_NOT_CREATED.code).json(CampaignMessages.CAMPAIGN_NOT_CREATED.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            });
        }
    }).catch(err => {
        res.status(CampaignMessages.CAMPAIGN_NOT_CREATED.code).json(CampaignMessages.CAMPAIGN_NOT_CREATED.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};

//////  /campaign/:id [PUT]
export const updateCampaing = (req: Request, res: Response) => {
    let campaingID = req.params.id;
    let formData = req.body;
    ManagementDB.Campaings.get(campaingID).then(obj => {
        ManagementDB.Campaings.put({...obj, ...formData}).then(() => {
            res.status(CampaignMessages.CAMPAIGN_UPDATED.code).json(CampaignMessages.CAMPAIGN_UPDATED.response);
        }).catch(err => {
            res.status(CampaignMessages.CAMPAIGN_UPDATED.code).json(CampaignMessages.CAMPAIGN_UPDATED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(CampaignMessages.CAMPAIGN_NOT_EXIST.code).json(CampaignMessages.CAMPAIGN_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /campaign/:id [GET]
export const getCampaing = (req: Request, res: Response) => {
    let campaingID = req.params.id;
    ManagementDB.Campaings.get(campaingID).then((obj: any) => {
        res.send(obj);
    }).catch(err => {
        res.status(CampaignMessages.CAMPAIGN_NOT_EXIST.code).json(CampaignMessages.CAMPAIGN_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /campaign/:id [DELETE]
export const deleteCampaing = (req: Request, res: Response) => {
    let campaingID = req.params.id;
    ManagementDB.Campaings.get(campaingID).then(obj => {
        ManagementDB.Campaings.remove(obj).then(() => {
            res.status(CampaignMessages.CAMPAIGN_DELETED.code).json(CampaignMessages.CAMPAIGN_DELETED.response);
        }).catch(err => {
            res.status(CampaignMessages.CAMPAIGN_NOT_DELETED.code).json(CampaignMessages.CAMPAIGN_NOT_DELETED.response);
            createLog(req, LogType.DATABASE_ERROR, err);
        })
    }).catch(err => {
        res.status(CampaignMessages.CAMPAIGN_NOT_EXIST.code).json(CampaignMessages.CAMPAIGN_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

//////  /campaigns + QueryString [GET]
export const queryCampaings = (req: Request, res: Response) => {
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Campaings.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        res.status(CampaignMessages.CAMPAIGN_NOT_EXIST.code).json(CampaignMessages.CAMPAIGN_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
};