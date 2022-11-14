import { DeliveryAddress } from "./DeliveryAddress";
import { DeliveryParty } from "./DeliveryParty";
import { DeliveryTerms } from "./DeliveryTerms";
import { Despatch } from "./Despatch";
import { Shipment } from "./Shipment";

/**
 * Delivery
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Delivery {
    /** xs:dateTime */
    ActualDeliveryDate?: string;
    /** DeliveryAddress */
    DeliveryAddress?: DeliveryAddress;
    /** DeliveryParty */
    DeliveryParty?: DeliveryParty;
    /** xs:string */
    DeliveryTermCode?: string;
    /** DeliveryTerms */
    DeliveryTerms?: DeliveryTerms;
    /** Despatch */
    Despatch?: Despatch;
    /** xs:dateTime */
    LatestDeliveryDate?: string;
    /** xs:string */
    ProductTraceId?: string;
    /** Shipment */
    Shipment?: Shipment;
    /** xs:string */
    TrackingId?: string;
}
