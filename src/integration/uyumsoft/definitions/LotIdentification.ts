import { LotNumberId } from "./LotNumberId";
import { AdditionalItemProperty } from "./AdditionalItemProperty";

/**
 * LotIdentification
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface LotIdentification {
    /** LotNumberID */
    LotNumberID?: LotNumberId;
    /** xs:date */
    ExpiryDate?: string;
    /** AdditionalItemProperty[] */
    AdditionalItemProperty?: Array<AdditionalItemProperty>;
}
