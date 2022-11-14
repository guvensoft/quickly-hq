import { Invoices } from "./Invoices";
import { PagingResponse } from "./PagingResponse";

/**
 * SearchAllInvoiceResult
 * @targetNSAlias `q30`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SearchAllInvoiceResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** Invoices */
    Invoices?: Invoices;
    /** PagingResponse */
    PagingResponse?: PagingResponse;
}
