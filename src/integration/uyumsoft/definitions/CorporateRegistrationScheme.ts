import { Id } from "./Id";
import { CorporateRegistrationTypeCode } from "./CorporateRegistrationTypeCode";
import { PostalAddress } from "./PostalAddress";

/**
 * CorporateRegistrationScheme
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface CorporateRegistrationScheme {
    /** ID */
    ID?: Id;
    /** xs:string */
    Name?: string;
    /** CorporateRegistrationTypeCode */
    CorporateRegistrationTypeCode?: CorporateRegistrationTypeCode;
    /** JurisdictionRegionAddress[] */
    JurisdictionRegionAddress?: Array<PostalAddress>;
}
