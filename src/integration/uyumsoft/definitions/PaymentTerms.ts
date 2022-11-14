import { InvoicePeriod } from "./InvoicePeriod";

/**
 * PaymentTerms
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface PaymentTerms {
    /** xs:string */
    Note?: string;
    /** xs:decimal */
    PenaltySurchargePercent?: string;
    /** xs:decimal */
    Amount?: string;
    /** xs:decimal */
    PenaltyAmount?: string;
    /** xs:date */
    PaymentDueDate?: string;
    /** SettlementPeriod */
    SettlementPeriod?: InvoicePeriod;
}
