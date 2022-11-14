import { Id } from "./Id";
import { TrackingId } from "./TrackingId";
import { PostalAddress } from "./PostalAddress";
import { PhysicalLocation } from "./PhysicalLocation";
import { InvoicePeriod } from "./InvoicePeriod";
import { IssuerParty } from "./IssuerParty";
import { Despatch } from "./Despatch";
import { DeliveryTerms } from "./DeliveryTerms";
import { Shipment } from "./Shipment";

/**
 * Delivery
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface Delivery {
    /** ID */
    ID?: Id;
    /** xs:decimal */
    Quantity?: string;
    /** xs:date */
    ActualDeliveryDate?: string;
    /** xs:time */
    ActualDeliveryTime?: string;
    /** xs:date */
    LatestDeliveryDate?: string;
    /** xs:time */
    LatestDeliveryTime?: string;
    /** TrackingID */
    TrackingID?: TrackingId;
    /** DeliveryAddress */
    DeliveryAddress?: PostalAddress;
    /** AlternativeDeliveryLocation */
    AlternativeDeliveryLocation?: PhysicalLocation;
    /** EstimatedDeliveryPeriod */
    EstimatedDeliveryPeriod?: InvoicePeriod;
    /** CarrierParty */
    CarrierParty?: IssuerParty;
    /** DeliveryParty */
    DeliveryParty?: IssuerParty;
    /** Despatch */
    Despatch?: Despatch;
    /** DeliveryTerms[] */
    DeliveryTerms?: Array<DeliveryTerms>;
    /** Shipment */
    Shipment?: Shipment;
}
