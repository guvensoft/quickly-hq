
/**
 * InvoiceAttachment
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface InvoiceAttachment {
    /** xs:base64Binary */
    FileContent?: string;
    /** xs:string */
    FileName?: string;
}
