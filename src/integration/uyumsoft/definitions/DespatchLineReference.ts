import { LineId } from "./LineId";
import { LineStatusCode } from "./LineStatusCode";
import { DocumentReference } from "./DocumentReference";

/**
 * DespatchLineReference
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface DespatchLineReference {
    /** LineID */
    LineID?: LineId;
    /** LineStatusCode */
    LineStatusCode?: LineStatusCode;
    /** DocumentReference */
    DocumentReference?: DocumentReference;
}
