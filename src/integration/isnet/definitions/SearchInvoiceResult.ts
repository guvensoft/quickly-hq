import { Invoices } from "./Invoices";
import { PagingResponse } from "./PagingResponse";

/**
 * SearchInvoiceResult
 * @targetNSAlias `q28`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SearchInvoiceResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** Invoices */
    Invoices?: Invoices;
    /** PagingResponse */
    PagingResponse?: PagingResponse;
}
