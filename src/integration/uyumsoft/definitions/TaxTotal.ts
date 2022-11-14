import { TaxSubtotal } from "./TaxSubtotal";

/**
 * TaxTotal
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface TaxTotal {
    /** xs:decimal */
    TaxAmount?: string;
    /** TaxSubtotal[] */
    TaxSubtotal?: Array<TaxSubtotal>;
}
