import { Invoices } from "./Invoices";

/**
 * request
 * @targetNSAlias `q1`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** Invoices */
    Invoices?: Invoices;
}
