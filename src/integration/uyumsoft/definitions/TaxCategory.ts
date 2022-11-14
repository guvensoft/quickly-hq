import { TaxExemptionReasonCode } from "./TaxExemptionReasonCode";
import { TaxScheme } from "./TaxScheme";

/**
 * TaxCategory
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface TaxCategory {
    /** xs:string */
    Name?: string;
    /** TaxExemptionReasonCode */
    TaxExemptionReasonCode?: TaxExemptionReasonCode;
    /** xs:string */
    TaxExemptionReason?: string;
    /** TaxScheme */
    TaxScheme?: TaxScheme;
}
