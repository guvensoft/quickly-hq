import { ArchiveInvoices2 } from "./ArchiveInvoices2";

/**
 * request
 * @targetNSAlias `q19`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request6 {
    /** ArchiveInvoices */
    ArchiveInvoices?: ArchiveInvoices2;
    /** xs:string */
    CompanyVendorNumber?: string;
}
