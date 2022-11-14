import { NationalityId } from "./NationalityId";
import { FinancialAccount } from "./FinancialAccount";
import { DocumentReference } from "./DocumentReference";

/**
 * Person
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface Person {
    /** xs:string */
    FirstName?: string;
    /** xs:string */
    FamilyName?: string;
    /** xs:string */
    Title?: string;
    /** xs:string */
    MiddleName?: string;
    /** xs:string */
    NameSuffix?: string;
    /** NationalityID */
    NationalityID?: NationalityId;
    /** FinancialAccount */
    FinancialAccount?: FinancialAccount;
    /** IdentityDocumentReference */
    IdentityDocumentReference?: DocumentReference;
}
