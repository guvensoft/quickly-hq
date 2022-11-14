import { ArchiveInvoiceList } from "./ArchiveInvoiceList";

/**
 * request
 * @targetNSAlias `q39`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request15 {
    /** ArchiveInvoiceList */
    ArchiveInvoiceList?: ArchiveInvoiceList;
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
}
