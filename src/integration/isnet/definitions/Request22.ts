import { DespatchAdvices } from "./DespatchAdvices";

/**
 * request
 * @targetNSAlias `q55`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request22 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** DespatchAdvices */
    DespatchAdvices?: DespatchAdvices;
}
