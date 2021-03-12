import { Request, Response } from "express";
import { ManagementDB, StoreDB, CouchDB, DatabaseQueryLimit } from '../../configrations/database';
import { Store } from '../../models/management/store';

// import { StoreMessages } from '../../utils/messages';
// import { storeTablesInfo, storeCashboxInfo, storeChecksInfo, storePaymentsInfo } from "../../functions/store/info";
// import { Table } from "../../models/store/pos/table";
// import { Cashbox } from "../..//models/store/pos/cashbox";
// import { Check } from "../..//models/store/pos/check";
// import { ClosedCheck } from "../..//models/store/pos/check";
// import { StoreInfo } from "../..//models/store/info";

export const endDayProcess = (req: Request, res: Response) => {
    console.log('Store', req.headers.store);
    console.log(req.body.docs);






}
