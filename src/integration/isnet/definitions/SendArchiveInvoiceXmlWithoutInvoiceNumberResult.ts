import { ArchiveInvoices1 } from "./ArchiveInvoices1";

/**
 * SendArchiveInvoiceXmlWithoutInvoiceNumberResult
 * @targetNSAlias `q20`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SendArchiveInvoiceXmlWithoutInvoiceNumberResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** ArchiveInvoices */
    ArchiveInvoices?: ArchiveInvoices1;
}
