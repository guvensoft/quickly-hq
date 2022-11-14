import { Id } from "./Id";
import { TransportEquipmentTypeCode } from "./TransportEquipmentTypeCode";

/**
 * TransportEquipment
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface TransportEquipment {
    /** ID */
    ID?: Id;
    /** TransportEquipmentTypeCode */
    TransportEquipmentTypeCode?: TransportEquipmentTypeCode;
    /** xs:string */
    Description?: string;
}
