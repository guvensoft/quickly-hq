import { Invoice } from "./Invoice";
import { TargetCustomer } from "./TargetCustomer";
import { EArchiveInvoiceInfo } from "./EArchiveInvoiceInfo";
import { Notification } from "./Notification";

/**
 * Items
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface Items1 {
    /** Invoice */
    Invoice?: Invoice;
    /** TargetCustomer */
    TargetCustomer?: TargetCustomer;
    /** EArchiveInvoiceInfo */
    EArchiveInvoiceInfo?: EArchiveInvoiceInfo;
    /** InvoiceScenarioChoosen|xs:string|Automated,eInvoice,eArchive,MusteArchive */
    Scenario?: string;
    /** Notification */
    Notification?: Notification;
    /** xs:dateTime */
    CreateDateUtc?: string;
}
