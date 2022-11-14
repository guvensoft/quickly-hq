import { IssuerParty } from "./IssuerParty";
import { Contact } from "./Contact";

/**
 * AccountingCustomerParty
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface AccountingCustomerParty {
    /** Party */
    Party?: IssuerParty;
    /** DeliveryContact */
    DeliveryContact?: Contact;
}
