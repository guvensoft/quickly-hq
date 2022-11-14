import { Id } from "./Id";
import { PostalAddress } from "./PostalAddress";
import { IssuerParty } from "./IssuerParty";
import { Contact } from "./Contact";
import { InvoicePeriod } from "./InvoicePeriod";

/**
 * Despatch
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface Despatch {
    /** ID */
    ID?: Id;
    /** xs:date */
    ActualDespatchDate?: string;
    /** xs:time */
    ActualDespatchTime?: string;
    /** xs:string */
    Instructions?: string;
    /** DespatchAddress */
    DespatchAddress?: PostalAddress;
    /** DespatchParty */
    DespatchParty?: IssuerParty;
    /** Contact */
    Contact?: Contact;
    /** EstimatedDespatchPeriod */
    EstimatedDespatchPeriod?: InvoicePeriod;
}
