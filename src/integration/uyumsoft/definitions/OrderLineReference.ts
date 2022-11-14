import { LineId } from "./LineId";
import { SalesOrderLineId } from "./SalesOrderLineId";
import { Uuid } from "./Uuid";
import { LineStatusCode } from "./LineStatusCode";
import { OrderReference } from "./OrderReference";

/**
 * OrderLineReference
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface OrderLineReference {
    /** LineID */
    LineID?: LineId;
    /** SalesOrderLineID */
    SalesOrderLineID?: SalesOrderLineId;
    /** UUID */
    UUID?: Uuid;
    /** LineStatusCode */
    LineStatusCode?: LineStatusCode;
    /** OrderReference */
    OrderReference?: OrderReference;
}
