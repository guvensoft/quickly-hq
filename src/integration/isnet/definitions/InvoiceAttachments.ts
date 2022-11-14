import { InvoiceAttachment } from "./InvoiceAttachment";

/**
 * InvoiceAttachments
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface InvoiceAttachments {
    /** InvoiceAttachment[] */
    InvoiceAttachment?: Array<InvoiceAttachment>;
}
