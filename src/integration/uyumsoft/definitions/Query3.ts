
/**
 * query
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface Query3 {
    /** xs:dateTime */
    ExecutionStartDate?: string;
    /** xs:dateTime */
    ExecutionEndDate?: string;
    /** xs:dateTime */
    CreateStartDate?: string;
    /** xs:dateTime */
    CreateEndDate?: string;
    /** InvoiceStatus|xs:string|NotPrepared,NotSend,Draft,Canceled,Queued,Processing,SentToGib,Approved,WaitingForAprovement,Declined,Return,EArchivedCanceled,Error */
    Status?: string;
    /** xs:string */
    InvoiceIds?: Array<string>;
    /** xs:string */
    InvoiceNumbers?: Array<string>;
    /** InvoiceStatus|xs:string|NotPrepared,NotSend,Draft,Canceled,Queued,Processing,SentToGib,Approved,WaitingForAprovement,Declined,Return,EArchivedCanceled,Error */
    StatusInList?: Array<string>;
    /** InvoiceStatus|xs:string|NotPrepared,NotSend,Draft,Canceled,Queued,Processing,SentToGib,Approved,WaitingForAprovement,Declined,Return,EArchivedCanceled,Error */
    StatusNotInList?: Array<string>;
    /** InvoiceListSortingColumn|xs:string|Default,Id,CreateDate,ExecutionDate */
    SortColumn?: string;
    /** QuerySortMode|xs:string|Default,Ascending,Descending */
    SortMode?: string;
    /** xs:boolean */
    IsArchived?: string;
    /** InvoiceScenarioType|xs:string|eInvoice,eArchive */
    Scenario?: string;
}
