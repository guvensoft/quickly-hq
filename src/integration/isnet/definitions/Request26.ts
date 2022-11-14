import { ReceiptAdvices } from "./ReceiptAdvices";

/**
 * request
 * @targetNSAlias `q63`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request26 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** ReceiptAdvices */
    ReceiptAdvices?: ReceiptAdvices;
}
