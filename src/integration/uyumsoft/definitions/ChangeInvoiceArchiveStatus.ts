import { InvoiceIds } from "./InvoiceIds";

/** ChangeInvoiceArchiveStatus */
export interface ChangeInvoiceArchiveStatus {
    /** invoiceIds */
    invoiceIds?: InvoiceIds;
    /** xs:boolean */
    isInbox?: string;
    /** xs:boolean */
    isArchived?: string;
}
