import { AdditionalTaxes } from "./AdditionalTaxes";

/**
 * CurrencyInvoiceDetail
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface CurrencyInvoiceDetail {
    /** AdditionalTaxes */
    AdditionalTaxes?: AdditionalTaxes;
    /** xs:decimal */
    CalculationRate?: string;
    /** xs:dateTime */
    CrossDate?: string;
    /** xs:string */
    CurrencyCode?: string;
    /** xs:decimal */
    PayableAmount?: string;
    /** xs:decimal */
    UsdCalculationRate?: string;
}
