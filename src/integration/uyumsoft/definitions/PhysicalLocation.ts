import { Id } from "./Id";
import { PostalAddress } from "./PostalAddress";

/**
 * PhysicalLocation
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface PhysicalLocation {
    /** ID */
    ID?: Id;
    /** Address */
    Address?: PostalAddress;
}
