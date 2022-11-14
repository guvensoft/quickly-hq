
/**
 * DocumentReference
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface DocumentReference {
    /** xs:string */
    CountryOfOrigin?: string;
    /** xs:dateTime */
    CustomsDeclarationDate?: string;
    /** xs:decimal */
    CustomsDeclarationNumber?: string;
    /** xs:dateTime */
    CustomsOfficeConfirmationLetterDate?: string;
    /** xs:decimal */
    CustomsOfficeConfirmationLetterNumber?: string;
    /** xs:string */
    CustomsOfficeInvoiceNumber?: string;
    /** xs:string */
    DocumentDescription?: string;
    /** xs:string */
    DocumentReferenceId?: string;
    /** xs:string */
    DocumentType?: string;
    /** xs:string */
    DocumentTypeCode?: string;
    /** xs:dateTime */
    ForeignCurrencyStatementDate?: string;
    /** xs:decimal */
    ForeignCurrencyStatementNumber?: string;
    /** xs:string */
    Id?: string;
    /** xs:dateTime */
    IssueDate?: string;
    /** xs:decimal */
    ReasonForComing?: string;
    /** xs:string */
    StatisticsNumber?: string;
}
