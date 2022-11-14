import { Id } from "./Id";

/**
 * DeliveryTerms
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface DeliveryTerms {
    /** ID */
    ID?: Id;
    /** xs:string */
    SpecialTerms?: string;
    /** xs:decimal */
    Amount?: string;
}
