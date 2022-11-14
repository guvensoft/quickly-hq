import { Id } from "./Id";
import { OtherCommunication } from "./OtherCommunication";

/**
 * Contact
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface Contact {
    /** ID */
    ID?: Id;
    /** xs:string */
    Name?: string;
    /** xs:string */
    Telephone?: string;
    /** xs:string */
    Telefax?: string;
    /** xs:string */
    ElectronicMail?: string;
    /** xs:string */
    Note?: string;
    /** OtherCommunication[] */
    OtherCommunication?: Array<OtherCommunication>;
}
