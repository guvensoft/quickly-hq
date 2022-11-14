import { Id } from "./Id";
import { PackageLevelCode } from "./PackageLevelCode";
import { PackagingTypeCode } from "./PackagingTypeCode";
import { GoodsItem } from "./GoodsItem";
import { RangeDimension } from "./RangeDimension";

/**
 * ActualPackage
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface ActualPackage {
    /** ID */
    ID?: Id;
    /** xs:decimal */
    Quantity?: string;
    /** xs:boolean */
    ReturnableMaterialIndicator?: string;
    /** PackageLevelCode */
    PackageLevelCode?: PackageLevelCode;
    /** PackagingTypeCode */
    PackagingTypeCode?: PackagingTypeCode;
    /** xs:string */
    PackingMaterial?: string;
    /** ContainedPackage[] */
    ContainedPackage?: Array<ActualPackage>;
    /** GoodsItem[] */
    GoodsItem?: Array<GoodsItem>;
    /** MeasurementDimension[] */
    MeasurementDimension?: Array<RangeDimension>;
}
