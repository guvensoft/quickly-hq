import { ProductTraceId } from "./ProductTraceId";
import { RegistrationId } from "./RegistrationId";
import { SerialId } from "./SerialId";
import { AdditionalItemProperty } from "./AdditionalItemProperty";
import { LotIdentification } from "./LotIdentification";

/**
 * ItemInstance
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface ItemInstance {
    /** ProductTraceID */
    ProductTraceID?: ProductTraceId;
    /** xs:date */
    ManufactureDate?: string;
    /** xs:time */
    ManufactureTime?: string;
    /** xs:date */
    BestBeforeDate?: string;
    /** RegistrationID */
    RegistrationID?: RegistrationId;
    /** SerialID */
    SerialID?: SerialId;
    /** AdditionalItemProperty[] */
    AdditionalItemProperty?: Array<AdditionalItemProperty>;
    /** LotIdentification */
    LotIdentification?: LotIdentification;
}
