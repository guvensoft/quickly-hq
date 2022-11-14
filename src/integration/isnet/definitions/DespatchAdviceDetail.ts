import { DeliveryList } from "./DeliveryList";
import { Product } from "./Product";

/**
 * DespatchAdviceDetail
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface DespatchAdviceDetail {
    /** xs:string */
    CurrencyCode?: string;
    /** DeliveryList */
    DeliveryList?: DeliveryList;
    /** xs:string */
    ImprintNumber?: string;
    /** xs:string */
    Note?: string;
    /** xs:decimal */
    OverSentQuantity?: string;
    /** Product */
    Product?: Product;
    /** xs:string */
    RelatedOrderLineNumber?: string;
    /** xs:decimal */
    SentQuantity?: string;
    /** xs:string */
    StockDescription?: string;
    /** xs:decimal */
    ToBeSentQuantity?: string;
    /** xs:string */
    ToBeSentQuantityReason?: string;
}
