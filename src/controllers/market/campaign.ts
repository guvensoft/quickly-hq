import { Request, Response } from "express";
import { createLog ,LogType } from "../../utils/logger";
import { CampaignMessages } from "../../utils/messages";
import { ManagementDB } from "../../configrations/database";

export const getMarketCampaigns = (req:Request, res:Response) => {
    ManagementDB.Campaings.find({ selector: req.query, limit: 5 }).then((obj: any) => {
        res.send(obj.docs);
    }).catch(err => {
        res.status(CampaignMessages.CAMPAIGN_NOT_EXIST.code).json(CampaignMessages.CAMPAIGN_NOT_EXIST.response);
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}