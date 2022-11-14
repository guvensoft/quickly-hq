import { PagingResponse } from "./PagingResponse";

/**
 * SearchESMMResult
 * @targetNSAlias `q76`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SearchEsmmResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** q60:ArrayOfESMM */
    ESMM?: string;
    /** PagingResponse */
    PagingResponse?: PagingResponse;
}
