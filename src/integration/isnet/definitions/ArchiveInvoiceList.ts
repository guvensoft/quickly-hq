import { ArchiveInvoiceCancellation } from "./ArchiveInvoiceCancellation";

/**
 * ArchiveInvoiceList
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface ArchiveInvoiceList {
    /** ArchiveInvoiceCancellation[] */
    ArchiveInvoiceCancellation?: Array<ArchiveInvoiceCancellation>;
}
