import { Carrier } from "./Carrier";

/**
 * WebSellingInfo
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface WebSellingInfo {
    /** Carrier */
    Carrier?: Carrier;
    /** xs:string */
    OtherPaymentType?: string;
    /** xs:dateTime */
    PaymentDate?: string;
    /** xs:string */
    PaymentMediatorName?: string;
    /** q17:PaymentType */
    PaymentType?: string;
    /** xs:dateTime */
    SendingDate?: string;
    /** xs:string */
    WebAddress?: string;
}
