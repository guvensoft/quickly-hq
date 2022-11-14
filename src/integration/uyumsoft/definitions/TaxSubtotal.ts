import { TaxCategory } from "./TaxCategory";

/**
 * TaxSubtotal
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface TaxSubtotal {
    /** xs:decimal */
    TaxableAmount?: string;
    /** xs:decimal */
    TaxAmount?: string;
    /** xs:decimal */
    CalculationSequenceNumeric?: string;
    /** xs:decimal */
    TransactionCurrencyTaxAmount?: string;
    /** xs:decimal */
    Percent?: string;
    /** xs:decimal */
    BaseUnitMeasure?: string;
    /** xs:decimal */
    PerUnitAmount?: string;
    /** TaxCategory */
    TaxCategory?: TaxCategory;
}
