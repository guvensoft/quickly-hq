
/**
 * request
 * @targetNSAlias `q37`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request14 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** InvoiceDirectionType|xs:string|Incoming,Outgoing */
    InvoiceDirection?: string;
    /** q38:ArrayOfstring */
    InvoiceETTNList?: string;
}
