import { Id } from "./Id";
import { NameCode } from "./NameCode";
import { ImportanceCode } from "./ImportanceCode";
import { InvoicePeriod } from "./InvoicePeriod";
import { ItemPropertyGroup } from "./ItemPropertyGroup";
import { RangeDimension } from "./RangeDimension";
import { ItemPropertyRange } from "./ItemPropertyRange";

/**
 * AdditionalItemProperty
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface AdditionalItemProperty {
    /** ID */
    ID?: Id;
    /** xs:string */
    Name?: string;
    /** NameCode */
    NameCode?: NameCode;
    /** xs:string */
    TestMethod?: string;
    /** xs:string */
    Value?: string;
    /** xs:decimal */
    ValueQuantity?: string;
    /** xs:string */
    ValueQualifier?: string;
    /** ImportanceCode */
    ImportanceCode?: ImportanceCode;
    /** xs:string */
    ListValue?: string;
    /** UsabilityPeriod */
    UsabilityPeriod?: InvoicePeriod;
    /** ItemPropertyGroup[] */
    ItemPropertyGroup?: Array<ItemPropertyGroup>;
    /** RangeDimension */
    RangeDimension?: RangeDimension;
    /** ItemPropertyRange */
    ItemPropertyRange?: ItemPropertyRange;
}
