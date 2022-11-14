import { FinancialInstitution } from "./FinancialInstitution";

/**
 * FinancialInstitutionBranch
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface FinancialInstitutionBranch {
    /** xs:string */
    Name?: string;
    /** FinancialInstitution */
    FinancialInstitution?: FinancialInstitution;
}
