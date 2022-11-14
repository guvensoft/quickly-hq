
/**
 * SearchExternalInvoiceResult
 * @targetNSAlias `q32`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SearchExternalInvoiceResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** q25:ArrayOfInvoiceSchema */
    Invoices?: string;
}
