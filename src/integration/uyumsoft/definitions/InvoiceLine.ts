import { Id } from "./Id";
import { OrderLineReference } from "./OrderLineReference";
import { DespatchLineReference } from "./DespatchLineReference";
import { Delivery } from "./Delivery";
import { AllowanceCharge } from "./AllowanceCharge";
import { TaxTotal } from "./TaxTotal";
import { Item } from "./Item";
import { Price } from "./Price";

/**
 * InvoiceLine
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface InvoiceLine {
    /** ID */
    ID?: Id;
    /** xs:string */
    Note?: string;
    /** xs:decimal */
    InvoicedQuantity?: string;
    /** xs:decimal */
    LineExtensionAmount?: string;
    /** OrderLineReference[] */
    OrderLineReference?: Array<OrderLineReference>;
    /** DespatchLineReference[] */
    DespatchLineReference?: Array<DespatchLineReference>;
    /** ReceiptLineReference[] */
    ReceiptLineReference?: Array<DespatchLineReference>;
    /** Delivery[] */
    Delivery?: Array<Delivery>;
    /** AllowanceCharge[] */
    AllowanceCharge?: Array<AllowanceCharge>;
    /** TaxTotal */
    TaxTotal?: TaxTotal;
    /** WithholdingTaxTotal[] */
    WithholdingTaxTotal?: Array<TaxTotal>;
    /** Item */
    Item?: Item;
    /** Price */
    Price?: Price;
    /** SubInvoiceLine[] */
    SubInvoiceLine?: Array<InvoiceLine>;
}
