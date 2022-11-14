
/**
 * SendESMMResult
 * @targetNSAlias `q72`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface SendEsmmResult {
    /** xs:string */
    ErrorMessage?: string;
    /** ResultType|xs:string|Success,Failed */
    Result?: string;
    /** xs:string */
    DocumentNumber?: string;
    /** xs:string */
    Ettn?: string;
    /** xs:string */
    ExternalESMMCode?: string;
}
