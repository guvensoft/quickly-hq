import { Id } from "./Id";
import { TransportHandlingUnitTypeCode } from "./TransportHandlingUnitTypeCode";
import { HandlingCode } from "./HandlingCode";
import { TraceId } from "./TraceId";
import { ActualPackage } from "./ActualPackage";
import { TransportEquipment } from "./TransportEquipment";
import { TransportMeans } from "./TransportMeans";
import { HazardousGoodsTransit } from "./HazardousGoodsTransit";
import { RangeDimension } from "./RangeDimension";
import { Temperature } from "./Temperature";
import { DocumentReference } from "./DocumentReference";
import { CustomsDeclaration } from "./CustomsDeclaration";

/**
 * TransportHandlingUnit
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface TransportHandlingUnit {
    /** ID */
    ID?: Id;
    /** TransportHandlingUnitTypeCode */
    TransportHandlingUnitTypeCode?: TransportHandlingUnitTypeCode;
    /** HandlingCode */
    HandlingCode?: HandlingCode;
    /** xs:string */
    HandlingInstructions?: string;
    /** xs:boolean */
    HazardousRiskIndicator?: string;
    /** xs:decimal */
    TotalGoodsItemQuantity?: string;
    /** xs:decimal */
    TotalPackageQuantity?: string;
    /** xs:string */
    DamageRemarks?: string;
    /** TraceID */
    TraceID?: TraceId;
    /** ActualPackage[] */
    ActualPackage?: Array<ActualPackage>;
    /** TransportEquipment[] */
    TransportEquipment?: Array<TransportEquipment>;
    /** TransportMeans[] */
    TransportMeans?: Array<TransportMeans>;
    /** HazardousGoodsTransit[] */
    HazardousGoodsTransit?: Array<HazardousGoodsTransit>;
    /** MeasurementDimension[] */
    MeasurementDimension?: Array<RangeDimension>;
    /** MinimumTemperature */
    MinimumTemperature?: Temperature;
    /** MaximumTemperature */
    MaximumTemperature?: Temperature;
    /** FloorSpaceMeasurementDimension */
    FloorSpaceMeasurementDimension?: RangeDimension;
    /** PalletSpaceMeasurementDimension */
    PalletSpaceMeasurementDimension?: RangeDimension;
    /** ShipmentDocumentReference[] */
    ShipmentDocumentReference?: Array<DocumentReference>;
    /** CustomsDeclaration[] */
    CustomsDeclaration?: Array<CustomsDeclaration>;
}
