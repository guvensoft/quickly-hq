import { InvoiceDetail } from "./InvoiceDetail";

/**
 * InvoiceDetails
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface InvoiceDetails {
    /** InvoiceDetail[] */
    InvoiceDetail?: Array<InvoiceDetail>;
}
