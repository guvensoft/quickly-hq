import { InvoiceReturn } from "./InvoiceReturn";

/**
 * Invoices
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Invoices1 {
    /** InvoiceReturn[] */
    InvoiceReturn?: Array<InvoiceReturn>;
}
