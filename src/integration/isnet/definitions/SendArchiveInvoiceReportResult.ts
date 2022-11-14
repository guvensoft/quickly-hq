
/**
 * SendArchiveInvoiceReportResult
 * @targetNSAlias `q42`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SendArchiveInvoiceReportResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** xs:string */
    ArchiveInvoiceReportGroupNumber?: string;
}
