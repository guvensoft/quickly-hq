import { DeliveryList } from "./DeliveryList";
import { Product } from "./Product";

/**
 * ReceiptAdviceDetail
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface ReceiptAdviceDetail {
    /** xs:string */
    CurrencyCode?: string;
    /** DeliveryList */
    DeliveryList?: DeliveryList;
    /** q46:ArrayOfstring */
    Notes?: string;
    /** xs:decimal */
    OversupplyQuantity?: string;
    /** Product */
    Product?: Product;
    /** xs:dateTime */
    ReceivedDate?: string;
    /** xs:decimal */
    ReceivedQuantity?: string;
    /** xs:string */
    RejectReasonCode?: string;
    /** q47:ArrayOfstring */
    RejectReasons?: string;
    /** xs:decimal */
    RejectedQuantity?: string;
    /** xs:string */
    RelatedDespatchLineNumber?: string;
    /** xs:string */
    RelatedOrderLineNumber?: string;
    /** xs:decimal */
    ShortQuantity?: string;
    /** xs:string */
    StockDescription?: string;
    /** xs:string */
    TimingComplaint?: string;
    /** xs:string */
    TimingComplaintCode?: string;
}
