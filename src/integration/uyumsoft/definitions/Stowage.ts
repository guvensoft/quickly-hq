import { LocationId } from "./LocationId";
import { PhysicalLocation } from "./PhysicalLocation";
import { RangeDimension } from "./RangeDimension";

/**
 * Stowage
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface Stowage {
    /** LocationID */
    LocationID?: LocationId;
    /** Location */
    Location?: PhysicalLocation;
    /** MeasurementDimension[] */
    MeasurementDimension?: Array<RangeDimension>;
}
