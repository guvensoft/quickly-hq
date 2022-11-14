import { Id } from "./Id";
import { IssuerParty } from "./IssuerParty";

/**
 * CustomsDeclaration
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface CustomsDeclaration {
    /** ID */
    ID?: Id;
    /** IssuerParty */
    IssuerParty?: IssuerParty;
}
