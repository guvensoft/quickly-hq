import { Invoices2 } from "./Invoices2";

/**
 * request
 * @targetNSAlias `q7`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request2 {
    /** xs:string */
    CompanyVendorNumber?: string;
    /** Invoices */
    Invoices?: Invoices2;
}
