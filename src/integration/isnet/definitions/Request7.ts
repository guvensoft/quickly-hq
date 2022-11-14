import { InvoiceReplies } from "./InvoiceReplies";

/**
 * request
 * @targetNSAlias `q21`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request7 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** InvoiceReplies */
    InvoiceReplies?: InvoiceReplies;
}
