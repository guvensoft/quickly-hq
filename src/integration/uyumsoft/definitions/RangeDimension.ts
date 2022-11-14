import { AttributeId } from "./AttributeId";

/**
 * RangeDimension
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface RangeDimension {
    /** AttributeID */
    AttributeID?: AttributeId;
    /** xs:decimal */
    Measure?: string;
    /** xs:string */
    Description?: string;
    /** xs:decimal */
    MinimumMeasure?: string;
    /** xs:decimal */
    MaximumMeasure?: string;
}
