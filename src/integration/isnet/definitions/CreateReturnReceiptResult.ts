
/**
 * CreateReturnReceiptResult
 * @targetNSAlias `q54`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface CreateReturnReceiptResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** xs:base64Binary */
    PdfFile?: string;
    /** xs:base64Binary */
    ReturnReceiptHtml?: string;
    /** xs:string */
    ReturnReceiptNumber?: string;
}
