import { PagingResponse } from "./PagingResponse";
import { ReceiptAdvices } from "./ReceiptAdvices";

/**
 * SearchReceiptAdviceResult
 * @targetNSAlias `q70`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SearchReceiptAdviceResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** PagingResponse */
    PagingResponse?: PagingResponse;
    /** ReceiptAdvices */
    ReceiptAdvices?: ReceiptAdvices;
}
