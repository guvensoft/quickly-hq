
/**
 * query
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface Query {
    /** xs:dateTime */
    ExecutionStartDate?: string;
    /** xs:dateTime */
    ExecutionEndDate?: string;
    /** xs:string */
    InvoiceIds?: Array<string>;
    /** xs:string */
    InvoiceNumbers?: Array<string>;
}
