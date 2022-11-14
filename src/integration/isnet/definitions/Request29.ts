import { ExcludeDetailStatusList } from "./ExcludeDetailStatusList";
import { ExcludeStatusList } from "./ExcludeStatusList";
import { PagingRequest } from "./PagingRequest";
import { ResultSet2 } from "./ResultSet2";

/**
 * request
 * @targetNSAlias `q69`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request29 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** xs:string */
    CurrencyCode?: string;
    /** xs:string */
    EnvelopeId?: string;
    /** xs:string */
    Ettn?: string;
    /** ExcludeDetailStatusList */
    ExcludeDetailStatusList?: ExcludeDetailStatusList;
    /** ExcludeStatusList */
    ExcludeStatusList?: ExcludeStatusList;
    /** xs:string */
    ExternalReceiptAdviceCode?: string;
    /** IncludeDetailStatusList */
    IncludeDetailStatusList?: ExcludeDetailStatusList;
    /** IncludeStatusList */
    IncludeStatusList?: ExcludeStatusList;
    /** xs:dateTime */
    MaxOrderDate?: string;
    /** xs:dateTime */
    MaxReceiptAdviceCreationDate?: string;
    /** xs:dateTime */
    MaxReceiptAdviceDate?: string;
    /** xs:string */
    MaxReceiptAdviceNumber?: string;
    /** xs:dateTime */
    MinOrderDate?: string;
    /** xs:dateTime */
    MinReceiptAdviceCreationDate?: string;
    /** xs:dateTime */
    MinReceiptAdviceDate?: string;
    /** xs:string */
    MinReceiptAdviceNumber?: string;
    /** xs:string */
    OrderNumber?: string;
    /** PagingRequest */
    PagingRequest?: PagingRequest;
    /** InvoiceDirectionType|xs:string|Incoming,Outgoing */
    ReceiptAdviceDirection?: string;
    /** ReceiptAdviceType|xs:string|SEVK */
    ReceiptAdviceType?: string;
    /** xs:string */
    ReceiverName?: string;
    /** xs:string */
    ReceiverTaxCode?: string;
    /** ResultSet */
    ResultSet?: ResultSet2;
    /** DespatchAdviceScenarioType|xs:string|TEMELIRSALIYE */
    ScenarioType?: string;
}
