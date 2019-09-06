import { Response, Request } from "express";
import { AdressDB } from "../../configrations/database";

////// /address/country/city/province/district [GET]
export const getAddress = (req: Request, res: Response) => {
    if (req.params.country) {
        if (req.params.city) {
            if (req.params.province) {
                if (req.params.district) {
                    AdressDB.Streets.find({ selector: { parent: req.params.district } }).then(db_res => { res.json(db_res.docs); });
                } else {
                    AdressDB.Districts.find({ selector: { parent: req.params.province } }).then(db_res => { res.json(db_res.docs); })
                }
            } else {
                AdressDB.Provinces.find({ selector: { parent: req.params.city } }).then(db_res => { res.json(db_res.docs); });
            }
        } else {
            AdressDB.Cities.find({ selector: {} }).then(db_res => { res.json(db_res.docs); });
        }
    } else {
        AdressDB.Countries.find({ selector: {} }).then(db_res => { res.json(db_res.docs); });
    }
}

////// /address/country/city/province/district [POST]
export const createAddress = (req: Request, res: Response) => {

}

////// /address/country/city/province/district [PUT]
export const updateAddress = (req: Request, res: Response) => {

}

////// /address/country/city/province/district [DELETE]
export const deleteAddress = (req: Request, res: Response) => {

}

////// /address/country/city/province/district/streets + QueryString [DELETE]
export const queryAddress = (req: Request, res: Response) => {

}