import { DocumentReference } from "./DocumentReference";
import { BillingReferenceLine } from "./BillingReferenceLine";

/**
 * BillingReference
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface BillingReference {
    /** InvoiceDocumentReference */
    InvoiceDocumentReference?: DocumentReference;
    /** SelfBilledInvoiceDocumentReference */
    SelfBilledInvoiceDocumentReference?: DocumentReference;
    /** CreditNoteDocumentReference */
    CreditNoteDocumentReference?: DocumentReference;
    /** SelfBilledCreditNoteDocumentReference */
    SelfBilledCreditNoteDocumentReference?: DocumentReference;
    /** DebitNoteDocumentReference */
    DebitNoteDocumentReference?: DocumentReference;
    /** ReminderDocumentReference */
    ReminderDocumentReference?: DocumentReference;
    /** AdditionalDocumentReference */
    AdditionalDocumentReference?: DocumentReference;
    /** BillingReferenceLine[] */
    BillingReferenceLine?: Array<BillingReferenceLine>;
}
