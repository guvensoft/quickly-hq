
/**
 * AbbreviationReport
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface AbbreviationReport {
    /** xs:boolean */
    CancelStatus?: boolean;
    /** xs:decimal */
    InvoiceCount?: number;
    /** xs:dateTime */
    ReportDate?: Date;
    /** xs:string */
    ReportNo?: string;
    /** xs:decimal */
    Total?: number;
    /** xs:decimal */
    TotalTax0?: number;
    /** xs:decimal */
    TotalTax1?: number;
    /** xs:decimal */
    TotalTax18?: number;
    /** xs:decimal */
    TotalTax8?: number;
    /** xs:decimal */
    TotalTaxBasis0?: number;
    /** xs:decimal */
    TotalTaxBasis1?: number;
    /** xs:decimal */
    TotalTaxBasis18?: number;
    /** xs:decimal */
    TotalTaxBasis8?: number;
}
