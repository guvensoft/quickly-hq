import { DespatchAdvices } from "./DespatchAdvices";
import { PagingResponse } from "./PagingResponse";

/**
 * SearchDespatchAdviceResult
 * @targetNSAlias `q62`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SearchDespatchAdviceResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** DespatchAdvices */
    DespatchAdvices?: DespatchAdvices;
    /** PagingResponse */
    PagingResponse?: PagingResponse;
}
