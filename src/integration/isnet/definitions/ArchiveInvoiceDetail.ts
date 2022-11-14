import { AdditionalTaxes } from "./AdditionalTaxes";
import { Product } from "./Product";

/**
 * ArchiveInvoiceDetail
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface ArchiveInvoiceDetail {
    /** AdditionalTaxes */
    AdditionalTaxes?: AdditionalTaxes;
    /** xs:string */
    CurrencyCode?: string;
    /** xs:decimal */
    DiscountAmount?: string;
    /** xs:decimal */
    DiscountRate?: string;
    /** xs:decimal */
    LineExtensionAmount?: string;
    /** xs:string */
    Note?: string;
    /** xs:string */
    OwnerIdentificationNumber?: string;
    /** xs:string */
    OwnerName?: string;
    /** Product */
    Product?: Product;
    /** xs:decimal */
    Quantity?: string;
    /** xs:decimal */
    SpecialBasisAmount?: string;
    /** xs:decimal */
    SpecialBasisPercent?: string;
    /** xs:string */
    SpecialBasisReasonCode?: string;
    /** xs:decimal */
    SpecialBasisTaxAmount?: string;
    /** xs:string */
    StockDescription?: string;
    /** xs:string */
    TagNumber?: string;
    /** xs:string */
    TaxExemptionReason?: string;
    /** xs:string */
    TaxExemptionReasonCode?: string;
    /** xs:decimal */
    VATAmount?: string;
    /** xs:decimal */
    VATRate?: string;
    /** WitholdingTaxes */
    WitholdingTaxes?: AdditionalTaxes;
}
