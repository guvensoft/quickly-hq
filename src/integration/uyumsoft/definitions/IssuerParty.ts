import { WebsiteUri } from "./WebsiteUri";
import { EndpointId } from "./EndpointId";
import { IndustryClassificationCode } from "./IndustryClassificationCode";
import { PartyIdentification } from "./PartyIdentification";
import { PartyName } from "./PartyName";
import { PostalAddress } from "./PostalAddress";
import { PhysicalLocation } from "./PhysicalLocation";
import { PartyTaxScheme } from "./PartyTaxScheme";
import { PartyLegalEntity } from "./PartyLegalEntity";
import { Contact } from "./Contact";
import { Person } from "./Person";

/**
 * IssuerParty
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface IssuerParty {
    /** WebsiteURI */
    WebsiteURI?: WebsiteUri;
    /** EndpointID */
    EndpointID?: EndpointId;
    /** IndustryClassificationCode */
    IndustryClassificationCode?: IndustryClassificationCode;
    /** PartyIdentification[] */
    PartyIdentification?: Array<PartyIdentification>;
    /** PartyName */
    PartyName?: PartyName;
    /** PostalAddress */
    PostalAddress?: PostalAddress;
    /** PhysicalLocation */
    PhysicalLocation?: PhysicalLocation;
    /** PartyTaxScheme */
    PartyTaxScheme?: PartyTaxScheme;
    /** PartyLegalEntity[] */
    PartyLegalEntity?: Array<PartyLegalEntity>;
    /** Contact */
    Contact?: Contact;
    /** Person */
    Person?: Person;
    /** AgentParty */
    AgentParty?: IssuerParty;
}
