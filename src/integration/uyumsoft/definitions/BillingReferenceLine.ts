import { Id } from "./Id";
import { AllowanceCharge } from "./AllowanceCharge";

/**
 * BillingReferenceLine
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface BillingReferenceLine {
    /** ID */
    ID?: Id;
    /** xs:decimal */
    Amount?: string;
    /** AllowanceCharge[] */
    AllowanceCharge?: Array<AllowanceCharge>;
}
