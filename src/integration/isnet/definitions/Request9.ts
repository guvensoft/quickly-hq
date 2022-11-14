
/**
 * request
 * @targetNSAlias `q25`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request9 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** q18:ArrayOfstring */
    InvoiceEttnList?: string;
    /** xs:string */
    NewCompanyVendorNumber?: string;
}
