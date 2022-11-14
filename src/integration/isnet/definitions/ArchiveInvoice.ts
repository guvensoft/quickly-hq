import { CompanyBranchAddress } from "./CompanyBranchAddress";
import { DispatchList } from "./DispatchList";
import { InvoiceAdditionalIdentityInfo } from "./InvoiceAdditionalIdentityInfo";
import { InvoiceAttachments } from "./InvoiceAttachments";
import { InvoiceDetails1 } from "./InvoiceDetails1";
import { InvoiceExpenses } from "./InvoiceExpenses";
import { AdditionalTaxes } from "./AdditionalTaxes";
import { Payment } from "./Payment";
import { Receiver } from "./Receiver";
import { WebSellingInfo } from "./WebSellingInfo";

/**
 * ArchiveInvoice
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface ArchiveInvoice {
    /** xs:string */
    AccountingCost?: string;
    /** xs:dateTime */
    ApprovalDate?: string;
    /** q10:ArchiveInvoiceApprovalStatus */
    ApprovalStatus?: string;
    /** xs:string */
    ArchiveCancellationReportNumber?: string;
    /** xs:dateTime */
    ArchiveDate?: string;
    /** xs:string */
    ArchiveInvoiceExternalUrl?: string;
    /** xs:string */
    ArchiveReportNumber?: string;
    /** q11:ArrayOfdecimal */
    BankAccountList?: string;
    /** q12:CanceledArchiveInvoiceReportSendingStatus */
    CancellationReportSendingStatus?: string;
    /** CompanyBranchAddress */
    CompanyBranchAddress?: CompanyBranchAddress;
    /** xs:decimal */
    CrossRate?: string;
    /** xs:dateTime */
    CrossRateDate?: string;
    /** xs:string */
    CurrencyCode?: string;
    /** DispatchList */
    DispatchList?: DispatchList;
    /** xs:string */
    ETTN?: string;
    /** xs:string */
    ExportRegisteredReasonCode?: string;
    /** xs:string */
    ExternalArchiveInvoiceCode?: string;
    /** xs:string */
    InstallationNumber?: string;
    /** InvoiceAdditionalIdentityInfo */
    InvoiceAdditionalIdentityInfo?: InvoiceAdditionalIdentityInfo;
    /** InvoiceAttachments */
    InvoiceAttachments?: InvoiceAttachments;
    /** xs:dateTime */
    InvoiceCreationDate?: string;
    /** xs:dateTime */
    InvoiceDate?: string;
    /** InvoiceDetails */
    InvoiceDetails?: InvoiceDetails1;
    /** InvoiceExpenses */
    InvoiceExpenses?: InvoiceExpenses;
    /** xs:string */
    InvoiceNumber?: string;
    /** xs:base64Binary */
    InvoicePdf?: string;
    /** InvoiceTotalTaxList */
    InvoiceTotalTaxList?: AdditionalTaxes;
    /** InvoiceType|xs:string|SATIS,IADE,ISTISNA,TEVKIFAT,OZELMATRAH,IHRACKAYITLI,SGK,KOMISYONCU,TEVKIFATIADE */
    InvoiceType?: string;
    /** xs:base64Binary */
    InvoiceXml?: string;
    /** xs:boolean */
    IsArchived?: string;
    /** xs:dateTime */
    LastPaymentDate?: string;
    /** q13:ArrayOfstring */
    Notes?: string;
    /** xs:dateTime */
    OrderDate?: string;
    /** xs:string */
    OrderNumber?: string;
    /** Payment */
    Payment?: Payment;
    /** Receiver */
    Receiver?: Receiver;
    /** ReceiverBranchAddress */
    ReceiverBranchAddress?: CompanyBranchAddress;
    /** q14:ArchiveInvoiceReportSendingStatus */
    ReportSendingStatus?: string;
    /** xs:dateTime */
    ReturnInvoiceDate?: string;
    /** xs:string */
    ReturnInvoiceNumber?: string;
    /** xs:string */
    ReturnReason?: string;
    /** xs:boolean */
    SendMailAutomatically?: string;
    /** q15:ArchiveInvoiceSendingStatus */
    SendingStatus?: string;
    /** q16:ArchiveInvoiceStatus */
    Status?: string;
    /** xs:string */
    TaxExemptionReason?: string;
    /** xs:decimal */
    TotalDiscountAmount?: string;
    /** xs:decimal */
    TotalLineExtensionAmount?: string;
    /** xs:decimal */
    TotalPayableAmount?: string;
    /** xs:decimal */
    TotalTaxInclusiveAmount?: string;
    /** xs:decimal */
    TotalVATAmount?: string;
    /** WebSellingInfo */
    WebSellingInfo?: WebSellingInfo;
    /** xs:base64Binary */
    XsltTemplate?: string;
}
