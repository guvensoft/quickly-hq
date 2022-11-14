
/**
 * Tax
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Tax {
    /** xs:decimal */
    TaxAmount?: string;
    /** xs:string */
    TaxCode?: string;
    /** xs:decimal */
    TaxRate?: string;
}
