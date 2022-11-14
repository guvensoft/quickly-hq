import { AdditionalDocumentReferences } from "./AdditionalDocumentReferences";
import { CompanyBranchAddress } from "./CompanyBranchAddress";
import { CurrencyInvoiceDetails } from "./CurrencyInvoiceDetails";
import { FinancialAccount } from "./FinancialAccount";
import { InvoiceAttachments } from "./InvoiceAttachments";
import { Receiver } from "./Receiver";

/**
 * CurrencyInvoice
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface CurrencyInvoice {
    /** AdditionalDocumentReferences */
    AdditionalDocumentReferences?: AdditionalDocumentReferences;
    /** xs:string */
    AliciBayiNo?: string;
    /** xs:string */
    AuthorizedInstitutionFileNumber?: string;
    /** q8:ArrayOfdecimal */
    BankAccountList?: string;
    /** CompanyBranchAddress */
    CompanyBranchAddress?: CompanyBranchAddress;
    /** xs:boolean */
    CopyIndicator?: string;
    /** xs:dateTime */
    CrossRateDate?: string;
    /** CurrencyInvoiceDetails */
    CurrencyInvoiceDetails?: CurrencyInvoiceDetails;
    /** CurrencyInvoiceType|xs:string|DOVIZALIMBELGESI,DOVIZSATIMBELGESI */
    CurrencyInvoiceType?: string;
    /** xs:string */
    EnvelopeId?: string;
    /** xs:string */
    Ettn?: string;
    /** xs:string */
    ExternalInvoiceCode?: string;
    /** FinancialAccount */
    FinancialAccount?: FinancialAccount;
    /** InvoiceAttachments */
    InvoiceAttachments?: InvoiceAttachments;
    /** xs:dateTime */
    InvoiceIssueDate?: string;
    /** xs:dateTime */
    InvoiceIssueTime?: string;
    /** xs:string */
    InvoiceNumber?: string;
    /** q9:ArrayOfstring */
    Notes?: string;
    /** Receiver */
    Receiver?: Receiver;
    /** ReceiverBranchAddress */
    ReceiverBranchAddress?: CompanyBranchAddress;
    /** xs:string */
    ReceiverInboxTag?: string;
    /** xs:decimal */
    RecipientTypeId?: string;
    /** xs:dateTime */
    ReturnInvoiceDate?: string;
    /** xs:string */
    ReturnInvoiceETTN?: string;
    /** xs:string */
    ReturnInvoiceNumber?: string;
    /** xs:string */
    ReturnNote?: string;
    /** xs:decimal */
    TotalPayableAmount?: string;
    /** xs:decimal */
    TotalTaxInclusiveAmount?: string;
    /** xs:decimal */
    TotalTurkishCurrencyEquivalent?: string;
    /** xs:base64Binary */
    XsltTemplate?: string;
}
