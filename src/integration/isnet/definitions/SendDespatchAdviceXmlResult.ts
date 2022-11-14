import { DespatchAdvices1 } from "./DespatchAdvices1";

/**
 * SendDespatchAdviceXmlResult
 * @targetNSAlias `q58`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SendDespatchAdviceXmlResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** DespatchAdvices */
    DespatchAdvices?: DespatchAdvices1;
}
