import { ExternalReference } from "./ExternalReference";

/**
 * Attachment
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface Attachment {
    /** xs:base64Binary */
    EmbeddedDocumentBinaryObject?: string;
    /** ExternalReference */
    ExternalReference?: ExternalReference;
}
