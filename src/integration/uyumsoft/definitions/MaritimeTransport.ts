import { VesselId } from "./VesselId";
import { RadioCallSignId } from "./RadioCallSignId";
import { DocumentReference } from "./DocumentReference";
import { PhysicalLocation } from "./PhysicalLocation";

/**
 * MaritimeTransport
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface MaritimeTransport {
    /** VesselID */
    VesselID?: VesselId;
    /** xs:string */
    VesselName?: string;
    /** RadioCallSignID */
    RadioCallSignID?: RadioCallSignId;
    /** xs:string */
    ShipsRequirements?: string;
    /** xs:decimal */
    GrossTonnageMeasure?: string;
    /** xs:decimal */
    NetTonnageMeasure?: string;
    /** RegistryCertificateDocumentReference */
    RegistryCertificateDocumentReference?: DocumentReference;
    /** RegistryPortLocation */
    RegistryPortLocation?: PhysicalLocation;
}
