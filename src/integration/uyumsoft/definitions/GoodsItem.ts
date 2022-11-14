import { Id } from "./Id";
import { RequiredCustomsId } from "./RequiredCustomsId";
import { CustomsStatusCode } from "./CustomsStatusCode";
import { TraceId } from "./TraceId";
import { Item } from "./Item";
import { AllowanceCharge } from "./AllowanceCharge";
import { InvoiceLine } from "./InvoiceLine";
import { Temperature } from "./Temperature";
import { PostalAddress } from "./PostalAddress";
import { RangeDimension } from "./RangeDimension";

/**
 * GoodsItem
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface GoodsItem {
    /** ID */
    ID?: Id;
    /** xs:string */
    Description?: string;
    /** xs:boolean */
    HazardousRiskIndicator?: string;
    /** xs:decimal */
    DeclaredCustomsValueAmount?: string;
    /** xs:decimal */
    DeclaredForCarriageValueAmount?: string;
    /** xs:decimal */
    DeclaredStatisticsValueAmount?: string;
    /** xs:decimal */
    FreeOnBoardValueAmount?: string;
    /** xs:decimal */
    InsuranceValueAmount?: string;
    /** xs:decimal */
    ValueAmount?: string;
    /** xs:decimal */
    GrossWeightMeasure?: string;
    /** xs:decimal */
    NetWeightMeasure?: string;
    /** xs:decimal */
    ChargeableWeightMeasure?: string;
    /** xs:decimal */
    GrossVolumeMeasure?: string;
    /** xs:decimal */
    NetVolumeMeasure?: string;
    /** xs:decimal */
    Quantity?: string;
    /** RequiredCustomsID */
    RequiredCustomsID?: RequiredCustomsId;
    /** CustomsStatusCode */
    CustomsStatusCode?: CustomsStatusCode;
    /** xs:decimal */
    CustomsTariffQuantity?: string;
    /** xs:boolean */
    CustomsImportClassifiedIndicator?: string;
    /** xs:decimal */
    ChargeableQuantity?: string;
    /** xs:decimal */
    ReturnableQuantity?: string;
    /** TraceID */
    TraceID?: TraceId;
    /** Item[] */
    Item?: Array<Item>;
    /** FreightAllowanceCharge[] */
    FreightAllowanceCharge?: Array<AllowanceCharge>;
    /** InvoiceLine[] */
    InvoiceLine?: Array<InvoiceLine>;
    /** Temperature[] */
    Temperature?: Array<Temperature>;
    /** OriginAddress */
    OriginAddress?: PostalAddress;
    /** MeasurementDimension[] */
    MeasurementDimension?: Array<RangeDimension>;
}
