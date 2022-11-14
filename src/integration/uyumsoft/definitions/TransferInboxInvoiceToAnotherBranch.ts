import { InvoiceIds } from "./InvoiceIds";

/** TransferInboxInvoiceToAnotherBranch */
export interface TransferInboxInvoiceToAnotherBranch {
    /** invoiceIds */
    invoiceIds?: InvoiceIds;
    /** xs:string */
    targetBranchAlias?: string;
}
