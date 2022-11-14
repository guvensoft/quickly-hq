import { Id } from "./Id";
import { DocumentTypeCode } from "./DocumentTypeCode";
import { Attachment } from "./Attachment";
import { InvoicePeriod } from "./InvoicePeriod";
import { IssuerParty } from "./IssuerParty";

/**
 * DocumentReference
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface DocumentReference {
    /** ID */
    ID?: Id;
    /** xs:date */
    IssueDate?: string;
    /** DocumentTypeCode */
    DocumentTypeCode?: DocumentTypeCode;
    /** xs:string */
    DocumentType?: string;
    /** xs:string */
    DocumentDescription?: string;
    /** Attachment */
    Attachment?: Attachment;
    /** ValidityPeriod */
    ValidityPeriod?: InvoicePeriod;
    /** IssuerParty */
    IssuerParty?: IssuerParty;
}
