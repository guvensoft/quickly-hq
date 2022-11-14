
/**
 * InvoicePeriod
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface InvoicePeriod {
    /** xs:date */
    StartDate?: string;
    /** xs:time */
    StartTime?: string;
    /** xs:date */
    EndDate?: string;
    /** xs:time */
    EndTime?: string;
    /** xs:decimal */
    DurationMeasure?: string;
    /** xs:string */
    Description?: string;
}
