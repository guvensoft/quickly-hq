import { ReceiptAdvices1 } from "./ReceiptAdvices1";

/**
 * SendReceiptAdviceResult
 * @targetNSAlias `q64`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SendReceiptAdviceResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** ReceiptAdvices */
    ReceiptAdvices?: ReceiptAdvices1;
}
