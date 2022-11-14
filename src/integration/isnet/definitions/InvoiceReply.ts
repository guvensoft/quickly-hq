
/**
 * InvoiceReply
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface InvoiceReply {
    /** xs:string */
    InvoiceETTN?: string;
    /** InvoiceResponseType|xs:string|KABUL,RED */
    InvoiceResponse?: string;
    /** xs:string */
    InvoiceResponseDescription?: string;
}
