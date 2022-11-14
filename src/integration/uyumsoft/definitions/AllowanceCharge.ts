
/**
 * AllowanceCharge
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface AllowanceCharge {
    /** xs:boolean */
    ChargeIndicator?: string;
    /** xs:string */
    AllowanceChargeReason?: string;
    /** xs:decimal */
    MultiplierFactorNumeric?: string;
    /** xs:decimal */
    SequenceNumeric?: string;
    /** xs:decimal */
    Amount?: string;
    /** xs:decimal */
    BaseAmount?: string;
    /** xs:decimal */
    PerUnitAmount?: string;
}
