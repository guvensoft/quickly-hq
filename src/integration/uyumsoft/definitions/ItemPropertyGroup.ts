import { Id } from "./Id";
import { ImportanceCode } from "./ImportanceCode";

/**
 * ItemPropertyGroup
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface ItemPropertyGroup {
    /** ID */
    ID?: Id;
    /** xs:string */
    Name?: string;
    /** ImportanceCode */
    ImportanceCode?: ImportanceCode;
}
