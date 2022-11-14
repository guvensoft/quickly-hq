import { Id } from "./Id";
import { CurrencyCode } from "./CurrencyCode";
import { FinancialInstitutionBranch } from "./FinancialInstitutionBranch";

/**
 * FinancialAccount
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface FinancialAccount {
    /** ID */
    ID?: Id;
    /** CurrencyCode */
    CurrencyCode?: CurrencyCode;
    /** xs:string */
    PaymentNote?: string;
    /** FinancialInstitutionBranch */
    FinancialInstitutionBranch?: FinancialInstitutionBranch;
}
