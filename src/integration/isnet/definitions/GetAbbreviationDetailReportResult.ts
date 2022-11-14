import { Reports1 } from "./Reports1";

/**
 * GetAbbreviationDetailReportResult
 * @targetNSAlias `q52`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface GetAbbreviationDetailReportResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** Reports */
    Reports?: Reports1;
}
