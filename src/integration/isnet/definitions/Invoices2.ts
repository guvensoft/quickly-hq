import { InvoiceXml } from "./InvoiceXml";

/**
 * Invoices
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Invoices2 {
    /** InvoiceXml[] */
    InvoiceXml?: Array<InvoiceXml>;
}
