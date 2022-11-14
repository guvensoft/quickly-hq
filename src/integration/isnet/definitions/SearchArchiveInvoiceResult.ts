import { ArchiveInvoices } from "./ArchiveInvoices";
import { PagingResponse } from "./PagingResponse";

/**
 * SearchArchiveInvoiceResult
 * @targetNSAlias `q34`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SearchArchiveInvoiceResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** ArchiveInvoices */
    ArchiveInvoices?: ArchiveInvoices;
    /** PagingResponse */
    PagingResponse?: PagingResponse;
}
