import { IdentificationCode } from "./IdentificationCode";

/**
 * Country
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface Country {
    /** IdentificationCode */
    IdentificationCode?: IdentificationCode;
    /** xs:string */
    Name?: string;
}
