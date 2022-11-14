import { ExcludeDetailStatusList } from "./ExcludeDetailStatusList";
import { ExcludeStatusList } from "./ExcludeStatusList";
import { PagingRequest } from "./PagingRequest";
import { ResultSet } from "./ResultSet";

/**
 * request
 * @targetNSAlias `q27`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request10 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** xs:string */
    CurrencyCode?: string;
    /** q19:ArrayOfstring */
    DispatchNumberList?: string;
    /** xs:string */
    EnvelopeId?: string;
    /** xs:string */
    Ettn?: string;
    /** ExcludeDetailStatusList */
    ExcludeDetailStatusList?: ExcludeDetailStatusList;
    /** ExcludeStatusList */
    ExcludeStatusList?: ExcludeStatusList;
    /** xs:string */
    ExternalInvoiceCode?: string;
    /** IncludeDetailStatusList */
    IncludeDetailStatusList?: ExcludeDetailStatusList;
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
    /** q20:ArrayOfstring */
    OrderNumberList?: string;
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
