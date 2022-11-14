
/**
 * LegalMonetaryTotal
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface LegalMonetaryTotal {
    /** xs:decimal */
    LineExtensionAmount?: string;
    /** xs:decimal */
    TaxExclusiveAmount?: string;
    /** xs:decimal */
    TaxInclusiveAmount?: string;
    /** xs:decimal */
    AllowanceTotalAmount?: string;
    /** xs:decimal */
    ChargeTotalAmount?: string;
    /** xs:decimal */
    PayableRoundingAmount?: string;
    /** xs:decimal */
    PayableAmount?: string;
}
