import { Response, Request } from "express";
import { AdressDB } from "../../configrations/database";

////// /address/country/state/province/district [GET]
export const getAddress = (req: Request, res: Response) => {
    if (req.params.country) {
        if (req.params.state) {
            if (req.params.province) {
                if (req.params.district) {
                    AdressDB.Streets.find({ selector: { parent: req.params.district } }).then(db_res => { res.json(db_res.docs); });
                } else {
                    AdressDB.Districts.find({ selector: { parent: req.params.province } }).then(db_res => { res.json(db_res.docs); })
                }
            } else {
                AdressDB.Provinces.find({ selector: { parent: req.params.state } }).then(db_res => { res.json(db_res.docs); });
            }
        } else {
            AdressDB.States.find({ selector: {} }).then(db_res => { res.json(db_res.docs); });
        }
    } else {
        AdressDB.Countries.find({ selector: {} }).then(db_res => { res.json(db_res.docs); });
    }
}

////// /address/country/state/province/district [POST]
export const createAddress = (req: Request, res: Response) => {

}

////// /address/country/state/province/district [PUT]
export const updateAddress = (req: Request, res: Response) => {

}

////// /address/country/state/province/district [DELETE]
export const deleteAddress = (req: Request, res: Response) => {

}

////// /address/country/state/province/district/streets + QueryString [DELETE]
export const queryAddress = (req: Request, res: Response) => {

}