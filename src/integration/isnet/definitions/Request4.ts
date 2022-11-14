import { ArchiveInvoices } from "./ArchiveInvoices";

/**
 * request
 * @targetNSAlias `q13`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request4 {
    /** ArchiveInvoices */
    ArchiveInvoices?: ArchiveInvoices;
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
}
