import { Invoices1 } from "./Invoices1";

/**
 * SendInvoiceResult
 * @targetNSAlias `q2`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SendInvoiceResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** Invoices */
    Invoices?: Invoices1;
}
