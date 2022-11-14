
/**
 * PagingResponse
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface PagingResponse {
    /** xs:int */
    PageNumber?: string;
    /** xs:int */
    RecordsPerPage?: string;
    /** xs:int */
    TotalNumberOfPages?: string;
    /** xs:int */
    TotalNumberOfRecords?: string;
}
