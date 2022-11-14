
/**
 * request
 * @targetNSAlias `q53`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request21 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** xs:string */
    Ettn?: string;
    /** xs:string */
    ExternalReturnReceiptNumber?: string;
    /** xs:string */
    ReceiverAddress?: string;
    /** xs:string */
    ReceiverName?: string;
    /** xs:string */
    ReceiverTaxCode?: string;
    /** xs:string */
    ReceiverTaxOffice?: string;
    /** xs:decimal */
    ReturnReceiptAmount?: string;
    /** xs:string */
    ReturnReceiptCurrencyCode?: string;
    /** xs:dateTime */
    ReturnReceiptDate?: string;
    /** xs:string */
    ReturnReceiptKdvBsmvNote?: string;
    /** xs:string */
    ReturnReceiptOperationPlace?: string;
    /** xs:string */
    ReturnReceiptReason?: string;
    /** xs:decimal */
    ReturnReceiptTaxRate?: string;
    /** xs:decimal */
    TotalReturnReceiptAmount?: string;
}
