import { CompanyId } from "./CompanyId";
import { TaxScheme } from "./TaxScheme";

/**
 * PartyTaxScheme
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface PartyTaxScheme {
    /** xs:string */
    RegistrationName?: string;
    /** CompanyID */
    CompanyID?: CompanyId;
    /** TaxScheme */
    TaxScheme?: TaxScheme;
}
