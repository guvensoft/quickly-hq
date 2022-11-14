import { ExcludeDetailStatusList } from "./ExcludeDetailStatusList";
import { ExcludeStatusList } from "./ExcludeStatusList";
import { PagingRequest } from "./PagingRequest";
import { ResultSet } from "./ResultSet";

/**
 * request
 * @targetNSAlias `q29`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request11 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CurrencyCode?: string;
    /** xs:string */
    EnvelopeId?: string;
    /** xs:string */
    Ettn?: string;
    /** q21:ArrayOfstring */
    ExcludeCompanyVendorNumberList?: string;
    /** ExcludeDetailStatusList */
    ExcludeDetailStatusList?: ExcludeDetailStatusList;
    /** q22:ArrayOfstring */
    ExcludeReceiverTaxCodeList?: string;
    /** ExcludeStatusList */
    ExcludeStatusList?: ExcludeStatusList;
    /** xs:string */
    ExternalInvoiceCode?: string;
    /** q23:ArrayOfstring */
    IncludeCompanyVendorNumberList?: string;
    /** IncludeDetailStatusList */
    IncludeDetailStatusList?: ExcludeDetailStatusList;
    /** xs:boolean */
    IncludeMainCompany?: string;
    /** q24:ArrayOfstring */
    IncludeReceiverTaxCodeList?: string;
    /** IncludeStatusList */
    IncludeStatusList?: ExcludeStatusList;
    /** InvoiceDirectionType|xs:string|Incoming,Outgoing */
    InvoiceDirection?: string;
    /** InvoiceType|xs:string|SATIS,IADE,ISTISNA,TEVKIFAT,OZELMATRAH,IHRACKAYITLI,SGK,KOMISYONCU,TEVKIFATIADE */
    InvoiceType?: string;
    /** xs:boolean */
    IsInvoicePaid?: string;
    /** xs:dateTime */
    MaxApprovalDate?: string;
    /** xs:string */
    MaxDirectionDate?: string;
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
    /** xs:string */
    MinDirectionDate?: string;
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
    /** ScenarioType|xs:string|None,TEMELFATURA,TICARIFATURA,IHRACAT,YOLCUBERABERFATURA,HKS,KAMU */
    ScenarioType?: string;
}
