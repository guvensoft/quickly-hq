import { Esmm } from "./Esmm";

/**
 * request
 * @targetNSAlias `q77`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request33 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** ESMM */
    ESMM?: Esmm;
}
