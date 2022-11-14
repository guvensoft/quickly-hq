import { SourceCurrencyCode } from "./SourceCurrencyCode";
import { TargetCurrencyCode } from "./TargetCurrencyCode";

/**
 * TaxExchangeRate
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface TaxExchangeRate {
    /** SourceCurrencyCode */
    SourceCurrencyCode?: SourceCurrencyCode;
    /** TargetCurrencyCode */
    TargetCurrencyCode?: TargetCurrencyCode;
    /** xs:decimal */
    CalculationRate?: string;
    /** xs:date */
    Date?: string;
}
