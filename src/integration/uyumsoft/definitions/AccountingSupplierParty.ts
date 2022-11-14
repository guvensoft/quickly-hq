import { IssuerParty } from "./IssuerParty";
import { Contact } from "./Contact";

/**
 * AccountingSupplierParty
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface AccountingSupplierParty {
    /** Party */
    Party?: IssuerParty;
    /** DespatchContact */
    DespatchContact?: Contact;
}
