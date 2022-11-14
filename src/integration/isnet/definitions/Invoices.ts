import { Invoice } from "./Invoice";

/**
 * Invoices
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Invoices {
    /** Invoice[] */
    Invoice?: Array<Invoice>;
}
