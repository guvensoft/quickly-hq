
/**
 * ArchiveInvoiceReport
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface ArchiveInvoiceReport {
    /** xs:string */
    ArchiveInvoiceReportGroupNumber?: string;
    /** xs:string */
    ArchiveInvoiceReportNumber?: string;
    /** q39:ArrayOfstring */
    InvoiceEttnList?: string;
    /** q40:ArchiveInvoiceReportStatus */
    Status?: string;
}
