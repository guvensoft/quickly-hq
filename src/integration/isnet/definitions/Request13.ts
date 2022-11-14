import { PagingRequest } from "./PagingRequest";
import { ResultSet } from "./ResultSet";

/**
 * request
 * @targetNSAlias `q33`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request13 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** xs:string */
    CurrencyCode?: string;
    /** xs:string */
    Ettn?: string;
    /** q26:ArrayOfArchiveInvoiceApprovalStatus */
    ExcludeApprovalStatusList?: string;
    /** q27:ArrayOfCanceledArchiveInvoiceReportSendingStatus */
    ExcludeCancellationReportSendingStatusList?: string;
    /** q28:ArrayOfArchiveInvoiceReportSendingStatus */
    ExcludeReportSendingStatusList?: string;
    /** q29:ArrayOfArchiveInvoiceSendingStatus */
    ExcludeSendingStatusList?: string;
    /** q30:ArrayOfArchiveInvoiceStatus */
    ExcludeStatusList?: string;
    /** xs:string */
    ExternalArchiveInvoiceCode?: string;
    /** q31:ArrayOfArchiveInvoiceApprovalStatus */
    IncludeApprovalStatusList?: string;
    /** q32:ArrayOfCanceledArchiveInvoiceReportSendingStatus */
    IncludeCancellationReportSendingStatusList?: string;
    /** q33:ArrayOfArchiveInvoiceReportSendingStatus */
    IncludeReportSendingStatusList?: string;
    /** q34:ArrayOfArchiveInvoiceSendingStatus */
    IncludeSendingStatusList?: string;
    /** q35:ArrayOfArchiveInvoiceStatus */
    IncludeStatusList?: string;
    /** InvoiceType|xs:string|SATIS,IADE,ISTISNA,TEVKIFAT,OZELMATRAH,IHRACKAYITLI,SGK,KOMISYONCU,TEVKIFATIADE */
    InvoiceType?: string;
    /** xs:boolean */
    IsCancelled?: string;
    /** xs:boolean */
    IsInvoicePaid?: string;
    /** xs:dateTime */
    MaxApprovalDate?: string;
    /** xs:dateTime */
    MaxInvoiceCreationDate?: string;
    /** xs:dateTime */
    MaxInvoiceDate?: string;
    /** xs:string */
    MaxInvoiceNumber?: string;
    /** xs:dateTime */
    MaxLastPaymentDate?: string;
    /** xs:dateTime */
    MaxOrderDate?: string;
    /** xs:dateTime */
    MaxPaymentDate?: string;
    /** xs:decimal */
    MaxTotalPayableAmount?: string;
    /** xs:dateTime */
    MinApprovalDate?: string;
    /** xs:dateTime */
    MinInvoiceCreationDate?: string;
    /** xs:dateTime */
    MinInvoiceDate?: string;
    /** xs:string */
    MinInvoiceNumber?: string;
    /** xs:dateTime */
    MinLastPaymentDate?: string;
    /** xs:dateTime */
    MinOrderDate?: string;
    /** xs:dateTime */
    MinPaymentDate?: string;
    /** xs:decimal */
    MinTotalPayableAmount?: string;
    /** xs:string */
    OrderNumber?: string;
    /** PagingRequest */
    PagingRequest?: PagingRequest;
    /** xs:string */
    ReceiverName?: string;
    /** xs:string */
    ReceiverTaxCode?: string;
    /** ResultSet */
    ResultSet?: ResultSet;
    /** q36:SendingType */
    SendingType?: string;
}
