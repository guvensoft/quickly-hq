import { Request, Response } from "express";
import { StoreDB, DatabaseQueryLimit } from '../../configrations/database';
import { createLog, LogType } from "../../utils/logger";
import { Pos, Menu, Device, Installment, Setup, Support, KVKK, } from '../../utils/agreements';
import { AgreementData, Bank, Client, DeviceAgreementData, MenuAgreementData, PosAgreementData } from '../../models/management/agreement';
import { Owner } from "../../models/management/owner";



export const showAgreement = async (req: Request, res: Response) => {
    const Type = req.params.type;
    const StoreID = req.headers.store;
    const Owner: Owner = req.body.owner;
    res.set('Content-Type', 'text/html');

    switch (Type) {
        case 'Pos':
            let client :Client = {
                short_name: 'Kosmos Beşiktaş',
                full_name: 'Özgür Sel',
                tax_office: "Beşiktaş",
                tax_number: "239482349",
                authorised_person: "Özgür Sel",
                address: "Vişnezade Mah No:85/1",
                email: "ozgurselr@gmail.com",
                user_name: "ocusel",
                password: "kosmos1234"
            }
            let bank: Bank = {
                name: "Ziraat Bankası",
                branch: "Tarabya Şubesi",
                owner: "Caner Düven",
                iban: "TR 34343 3434 3434 34343 4",
                payment_type: "Mobil Ödeme"
            }

            let posAgreementData: PosAgreementData = {
                sign_date: "17 Kasım 2022",
                start_date: "17 Kasım 2022",
                end_date: "17 Kasım 2023",
                setup_date: "17 Kasım 2022",
                remote_support: "10",
                local_support: "3",
                free_support: "200",
                support_fee: "200",
                total_support: "500",
                installation_fee: "100",
                total_fee: "1500"
            }


            res.send(Buffer.from(Pos(client,bank,posAgreementData)));
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