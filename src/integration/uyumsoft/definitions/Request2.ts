import { Mailing } from "./Mailing";
import { Messaging } from "./Messaging";

/**
 * request
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface Request2 {
    /** Mailing[] */
    Mailing?: Array<Mailing>;
    /** Messaging[] */
    Messaging?: Array<Messaging>;
}
