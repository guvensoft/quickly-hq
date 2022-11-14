
/**
 * request
 * @targetNSAlias `q31`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request12 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** InvoiceDirectionType|xs:string|Incoming,Outgoing */
    InvoiceDirection?: string;
    /** xs:string */
    InvoiceNumber?: string;
    /** xs:dateTime */
    MaxInvoiceDate?: string;
    /** xs:dateTime */
    MinInvoiceDate?: string;
}
