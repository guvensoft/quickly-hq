import { AdditionalTaxes } from "./AdditionalTaxes";
import { DeliveryList } from "./DeliveryList";
import { Product } from "./Product";

/**
 * InvoiceDetail
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface InvoiceDetail {
    /** AdditionalTaxes */
    AdditionalTaxes?: AdditionalTaxes;
    /** xs:string */
    CurrencyCode?: string;
    /** q5:ArrayOfstring */
    CustomsTrackingNumberList?: string;
    /** DeliveryList */
    DeliveryList?: DeliveryList;
    /** xs:decimal */
    DiscountAmount?: string;
    /** xs:decimal */
    DiscountRate?: string;
    /** xs:decimal */
    IdMensei?: string;
    /** xs:decimal */
    IdSiniflandirmaKodu?: string;
    /** xs:decimal */
    LineExtensionAmount?: string;
    /** xs:string */
    LineId?: string;
    /** xs:string */
    Mensei?: string;
    /** xs:string */
    Note?: string;
    /** xs:string */
    OwnerIdentificationNumber?: string;
    /** xs:string */
    OwnerName?: string;
    /** xs:string */
    PackageBrand?: string;
    /** Product */
    Product?: Product;
    /** xs:decimal */
    Quantity?: string;
    /** xs:string */
    SalesOrderLineId?: string;
    /** xs:string */
    SiniflandirmaKodu?: string;
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
    /** xs:string */
    UUID?: string;
    /** xs:decimal */
    VATAmount?: string;
    /** xs:decimal */
    VATRate?: string;
    /** WitholdingTaxes */
    WitholdingTaxes?: AdditionalTaxes;
}
