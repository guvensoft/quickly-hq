
/**
 * InvoiceXml
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface InvoiceXml {
    /** xs:base64Binary */
    InvoiceContent?: string;
    /** xs:string */
    ReceiverTag?: string;
}
