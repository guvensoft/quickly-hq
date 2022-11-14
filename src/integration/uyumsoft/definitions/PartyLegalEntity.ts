import { CompanyId } from "./CompanyId";
import { CorporateRegistrationScheme } from "./CorporateRegistrationScheme";
import { IssuerParty } from "./IssuerParty";

/**
 * PartyLegalEntity
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface PartyLegalEntity {
    /** xs:string */
    RegistrationName?: string;
    /** CompanyID */
    CompanyID?: CompanyId;
    /** xs:date */
    RegistrationDate?: string;
    /** xs:boolean */
    SoleProprietorshipIndicator?: string;
    /** xs:decimal */
    CorporateStockAmount?: string;
    /** xs:boolean */
    FullyPaidSharesIndicator?: string;
    /** CorporateRegistrationScheme */
    CorporateRegistrationScheme?: CorporateRegistrationScheme;
    /** HeadOfficeParty */
    HeadOfficeParty?: IssuerParty;
}
