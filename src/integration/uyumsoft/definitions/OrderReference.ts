import { Id } from "./Id";
import { SalesOrderId } from "./SalesOrderId";
import { OrderTypeCode } from "./OrderTypeCode";
import { DocumentReference } from "./DocumentReference";

/**
 * OrderReference
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface OrderReference {
    /** ID */
    ID?: Id;
    /** SalesOrderID */
    SalesOrderID?: SalesOrderId;
    /** xs:date */
    IssueDate?: string;
    /** OrderTypeCode */
    OrderTypeCode?: OrderTypeCode;
    /** DocumentReference */
    DocumentReference?: DocumentReference;
}
