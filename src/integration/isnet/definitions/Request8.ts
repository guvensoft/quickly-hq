import { BaseInvoiceReplies } from "./BaseInvoiceReplies";

/**
 * request
 * @targetNSAlias `q23`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request8 {
    /** BaseInvoiceReplies */
    BaseInvoiceReplies?: BaseInvoiceReplies;
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
}
