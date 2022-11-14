import { DespatchAdvices1 } from "./DespatchAdvices1";

/**
 * SendDespatchAdviceResult
 * @targetNSAlias `q56`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SendDespatchAdviceResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** DespatchAdvices */
    DespatchAdvices?: DespatchAdvices1;
}
