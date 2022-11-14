import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { createLog, LogType } from "../../utils/logger";
import { Pos, Menu, Device, Installment, Setup, Support, KVKK } from '../../utils/agreements';
import { Owner } from "../../models/management/owner";

type AgreementType = 'Pos' | 'Menu' | 'Device' | 'Installment' | 'Setup' | 'Support' | 'Kvkk' | ''

export const showAgreement = async (req: Request, res: Response) => {
    const Type = req.params.type;
    const StoreID = req.headers.store;
    const Owner: Owner = req.body.owner;
    res.set('Content-Type', 'text/html');

    switch (Type) {
        case 'Pos':
            res.send(Buffer.from(Pos()));
            break;
        case 'Menu':
            res.send(Buffer.from(Menu()));
            break;
        case 'Device':
            res.send(Buffer.from(Device()));
            break;
        case 'Installment':
            res.send(Buffer.from(Installment()));
            break;
        case 'Setup':
            res.send(Buffer.from(Setup()));
        case 'Support':
            res.send(Buffer.from(Support()));
            break;
        case 'Kvkk':
            res.send(Buffer.from(KVKK()));
            break;
        default:
            break;
    }

}