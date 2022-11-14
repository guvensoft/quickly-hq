import { ArchiveInvoiceReportList } from "./ArchiveInvoiceReportList";

/**
 * SearchArchiveInvoiceReportResult
 * @targetNSAlias `q44`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SearchArchiveInvoiceReportResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** ArchiveInvoiceReportList */
    ArchiveInvoiceReportList?: ArchiveInvoiceReportList;
}
