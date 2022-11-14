import { LineResponses } from "./LineResponses";

/**
 * DocumentResponseInfo
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface DocumentResponseInfo {
    /** LineResponses */
    LineResponses?: LineResponses;
    /** xs:string */
    InvoiceId?: string;
    /** DocumentResponseStatus|xs:string|Approved,Declined,Return */
    ResponseStatus?: string;
    /** xs:string */
    Reason?: string;
}
