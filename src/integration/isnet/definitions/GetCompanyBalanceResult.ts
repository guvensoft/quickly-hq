
/**
 * GetCompanyBalanceResult
 * @targetNSAlias `q80`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface GetCompanyBalanceResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** xs:int */
    Balance?: string;
}
