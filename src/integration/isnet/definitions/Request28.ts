import { ReceiptAdvices2 } from "./ReceiptAdvices2";

/**
 * request
 * @targetNSAlias `q67`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request28 {
    /** xs:string */
    CompanyVendorNumber?: string;
    /** ReceiptAdvices */
    ReceiptAdvices?: ReceiptAdvices2;
}
