import { ExcludeDetailStatusList } from "./ExcludeDetailStatusList";
import { ExcludeStatusList } from "./ExcludeStatusList";
import { PagingRequest } from "./PagingRequest";
import { ResultSet1 } from "./ResultSet1";

/**
 * request
 * @targetNSAlias `q61`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request25 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** xs:string */
    CurrencyCode?: string;
    /** InvoiceDirectionType|xs:string|Incoming,Outgoing */
    DespatchAdviceDirection?: string;
    /** q44:ArrayOfstring */
    DespatchAdviceNumberList?: string;
    /** DespatchAdviceType|xs:string|SEVK,MATBUDAN */
    DespatchAdviceType?: string;
    /** xs:string */
    EnvelopeId?: string;
    /** xs:string */
    Ettn?: string;
    /** ExcludeDetailStatusList */
    ExcludeDetailStatusList?: ExcludeDetailStatusList;
    /** ExcludeStatusList */
    ExcludeStatusList?: ExcludeStatusList;
    /** xs:string */
    ExternalDespatchAdviceCode?: string;
    /** IncludeDetailStatusList */
    IncludeDetailStatusList?: ExcludeDetailStatusList;
    /** IncludeStatusList */
    IncludeStatusList?: ExcludeStatusList;
    /** xs:dateTime */
    MaxDespatchAdviceCreationDate?: string;
    /** xs:dateTime */
    MaxDespatchAdviceDate?: string;
    /** xs:string */
    MaxDespatchAdviceNumber?: string;
    /** xs:dateTime */
    MaxOrderDate?: string;
    /** xs:dateTime */
    MinDespatchAdviceCreationDate?: string;
    /** xs:dateTime */
    MinDespatchAdviceDate?: string;
    /** xs:string */
    MinDespatchAdviceNumber?: string;
    /** xs:dateTime */
    MinOrderDate?: string;
    /** xs:string */
    OrderNumber?: string;
    /** PagingRequest */
    PagingRequest?: PagingRequest;
    /** xs:string */
    ReceiverName?: string;
    /** xs:string */
    ReceiverTaxCode?: string;
    /** ResultSet */
    ResultSet?: ResultSet1;
    /** DespatchAdviceScenarioType|xs:string|TEMELIRSALIYE */
    ScenarioType?: string;
}
