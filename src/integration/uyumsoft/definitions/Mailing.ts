import { Attachment1 } from "./Attachment1";

/**
 * Mailing
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface Mailing {
    /** xs:string */
    Subject?: string;
    /** Attachment */
    Attachment?: Attachment1;
}
