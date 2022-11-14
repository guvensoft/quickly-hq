import { DespatchAdvices2 } from "./DespatchAdvices2";

/**
 * request
 * @targetNSAlias `q59`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request24 {
    /** xs:string */
    CompanyVendorNumber?: string;
    /** DespatchAdvices */
    DespatchAdvices?: DespatchAdvices2;
}
