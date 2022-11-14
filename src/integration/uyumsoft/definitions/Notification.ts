import { Mailing } from "./Mailing";
import { Messaging } from "./Messaging";

/**
 * Notification
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface Notification {
    /** Mailing[] */
    Mailing?: Array<Mailing>;
    /** Messaging[] */
    Messaging?: Array<Messaging>;
}
