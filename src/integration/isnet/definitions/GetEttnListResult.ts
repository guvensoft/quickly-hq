
/**
 * GetEttnListResult
 * @targetNSAlias `q48`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface GetEttnListResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** xs:int */
    Count?: string;
    /** q41:ArrayOfstring */
    EttnList?: string;
}
