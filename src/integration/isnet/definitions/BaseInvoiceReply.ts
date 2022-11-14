
/**
 * BaseInvoiceReply
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface BaseInvoiceReply {
    /** BaseInvoiceResponseType|xs:string|KABUL,RED,IADE_EDILDI */
    BaseInvoiceResponse?: string;
    /** xs:string */
    InvoiceETTN?: string;
}
