import { Id } from "./Id";
import { HandlingCode } from "./HandlingCode";
import { GoodsItem } from "./GoodsItem";
import { ShipmentStage } from "./ShipmentStage";
import { Delivery } from "./Delivery";
import { TransportHandlingUnit } from "./TransportHandlingUnit";
import { PostalAddress } from "./PostalAddress";
import { PhysicalLocation } from "./PhysicalLocation";

/**
 * Shipment
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface Shipment {
    /** ID */
    ID?: Id;
    /** HandlingCode */
    HandlingCode?: HandlingCode;
    /** xs:string */
    HandlingInstructions?: string;
    /** xs:decimal */
    GrossWeightMeasure?: string;
    /** xs:decimal */
    NetWeightMeasure?: string;
    /** xs:decimal */
    GrossVolumeMeasure?: string;
    /** xs:decimal */
    NetVolumeMeasure?: string;
    /** xs:decimal */
    TotalGoodsItemQuantity?: string;
    /** xs:decimal */
    TotalTransportHandlingUnitQuantity?: string;
    /** xs:decimal */
    InsuranceValueAmount?: string;
    /** xs:decimal */
    DeclaredCustomsValueAmount?: string;
    /** xs:decimal */
    DeclaredForCarriageValueAmount?: string;
    /** xs:decimal */
    DeclaredStatisticsValueAmount?: string;
    /** xs:decimal */
    FreeOnBoardValueAmount?: string;
    /** xs:string */
    SpecialInstructions?: string;
    /** GoodsItem[] */
    GoodsItem?: Array<GoodsItem>;
    /** ShipmentStage[] */
    ShipmentStage?: Array<ShipmentStage>;
    /** Delivery */
    Delivery?: Delivery;
    /** TransportHandlingUnit[] */
    TransportHandlingUnit?: Array<TransportHandlingUnit>;
    /** ReturnAddress */
    ReturnAddress?: PostalAddress;
    /** FirstArrivalPortLocation */
    FirstArrivalPortLocation?: PhysicalLocation;
    /** LastExitPortLocation */
    LastExitPortLocation?: PhysicalLocation;
}
