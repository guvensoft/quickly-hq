import { KeyValue } from "./KeyValue";
import { PgpData } from "./PgpData";
import { RetrievalMethod } from "./RetrievalMethod";
import { SpkiData } from "./SpkiData";
import { X509Data } from "./X509Data";

/**
 * KeyInfo
 * @targetNSAlias `tns`
 * @targetNamespace `http://www.w3.org/2000/09/xmldsig#`
 */
export interface KeyInfo {
    /** a */
    0?: string;
    /** n */
    1?: string;
    /** y */
    2?: string;
    /** KeyValue */
    KeyValue?: KeyValue;
    /** xs:string */
    MgmtData?: string;
    /** PGPData */
    PGPData?: PgpData;
    /** RetrievalMethod */
    RetrievalMethod?: RetrievalMethod;
    /** xs:string */
    KeyName?: string;
    /** SPKIData */
    SPKIData?: SpkiData;
    /** X509Data */
    X509Data?: X509Data;
}
