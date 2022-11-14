import { ArchiveInvoices1 } from "./ArchiveInvoices1";

/**
 * SendArchiveInvoiceResult
 * @targetNSAlias `q14`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SendArchiveInvoiceResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** ArchiveInvoices */
    ArchiveInvoices?: ArchiveInvoices1;
}
