import { PaymentAccount } from "./PaymentAccount";

/**
 * Payment
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Payment {
    /** xs:string */
    InvoiceETTN?: string;
    /** PaymentAccount */
    PaymentAccount?: PaymentAccount;
    /** PaymentChannel|xs:string|NONE,CommercialBanking */
    PaymentChannel?: string;
    /** xs:string */
    PaymentChannelCode?: string;
    /** xs:dateTime */
    PaymentDate?: string;
}
