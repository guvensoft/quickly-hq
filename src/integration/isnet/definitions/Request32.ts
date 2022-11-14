import { PagingRequest } from "./PagingRequest";

/**
 * request
 * @targetNSAlias `q75`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request32 {
    /** xs:boolean */
    Archived?: string;
    /** xs:decimal */
    CompanyId?: string;
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** xs:string */
    DocumentNumber?: string;
    /** xs:string */
    Ettn?: string;
    /** q49:ArrayOfDocumentApprovalStatus */
    ExcludeApprovalStatusList?: string;
    /** q50:ArrayOfCanceledDocumentReportSendingStatus */
    ExcludeCancellationReportSendingStatusList?: string;
    /** q51:ArrayOfDocumentReportSendingStatus */
    ExcludeReportSendingStatusList?: string;
    /** q52:ArrayOfDocumentSendingStatus */
    ExcludeSendingStatusList?: string;
    /** q53:ArrayOfDocumentStatus */
    ExcludeStatusList?: string;
    /** xs:string */
    ExternalDocumentNumber?: string;
    /** xs:decimal */
    IdMainCompany?: string;
    /** q54:ArrayOfDocumentApprovalStatus */
    IncludeApprovalStatusList?: string;
    /** q55:ArrayOfCanceledDocumentReportSendingStatus */
    IncludeCancellationReportSendingStatusList?: string;
    /** q56:ArrayOfDocumentReportSendingStatus */
    IncludeReportSendingStatusList?: string;
    /** q57:ArrayOfDocumentSendingStatus */
    IncludeSendingStatusList?: string;
    /** q58:ArrayOfDocumentStatus */
    IncludeStatusList?: string;
    /** xs:boolean */
    IsCanceled?: string;
    /** xs:boolean */
    IsDeleted?: string;
    /** xs:decimal */
    MaxCost?: string;
    /** xs:dateTime */
    MaxDocumentCreationDate?: string;
    /** xs:dateTime */
    MaxDocumentDate?: string;
    /** xs:decimal */
    MinCost?: string;
    /** xs:dateTime */
    MinDocumentCreationDate?: string;
    /** xs:dateTime */
    MinDocumentDate?: string;
    /** PagingRequest */
    PagingRequest?: PagingRequest;
    /** xs:string */
    ReceiverName?: string;
    /** q59:ESMMResultSet */
    ResultSet?: string;
    /** xs:string */
    SchemaName?: string;
    /** xs:string */
    VNKTCKN?: string;
}
